<template>
	<div class="dashcontent">
		<h1><i class="fa fa-camera-retro" aria-hidden="true"></i> Snapshots</h1>
		<div class="dropdown manybtn">
			<button class="dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				<i class="fa fa-plus-circle" aria-hidden="true"></i> Create
				<span class="caret"></span>
			</button>
			<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
				<li v-if="is_reseller">
					<nuxt-link :to="{name: 'user-subuser-create'}">New Subuser</nuxt-link>
				</li>
				<li v-if="enabledBilling && !is_reseller">
					<nuxt-link :to="{name: 'user-instance-create'}">New Instance</nuxt-link>
				</li>
				<li v-if="is_reseller">
					<nuxt-link :to="{name: 'user-instance-reseller-create'}">New Instance</nuxt-link>
				</li>
				<li>
					<nuxt-link :to="{name: 'user-firewall-create'}">New Firewall</nuxt-link>
				</li>
				<li>
					<nuxt-link :to="{name: 'user-ssh-key-create'}">New SSH Key</nuxt-link>
				</li>
			</ul>
		</div>
		<div class="dashstuff">
			<div class="col-md-10">
				<div class="wow fadeIn blocks firewall-manage snapshots" v-if="snapshots.data.length >= 1">
					<input type="search" placeholder="Search snapshots" v-model="pagination_search" @keyup.enter="search"/>
					<br><br>
					<div class="table-responsive">
						<table class="table snapshotslist">
							<thead>
							<tr>
								<th>Name</th>
								<th>Size</th>
								<th>Hypervisor</th>
								<th>Data created</th>
								<th>Action</th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="(snapshot,$index) in snapshots.data">
								<td>
									<span v-if="!snapshot.editing">{{ snapshot.name }} <i class="fas fa-edit" style="cursor:pointer" @click.prevent="$set($data.snapshots.data[$index],'editing',true)"></i></span>
									<span v-if="snapshot.editing">
										<div class="input-group">
											<input type="text" class="form-control" placeholder="Name" v-model="snapshot.name" @keyup="update_name(snapshot, $index)">
											<div class="input-group-addon">
												<button class="btn" type="button" @click.prevent="update_name(snapshot,$index)" :disabled="snapshot.update_processing">
													<i class="fa fa-spin fa-spinner" v-if="snapshot.update_processing"></i>
													<i class="fas fa-check" v-else></i>
												</button>
											</div>
										</div>
									</span>
								</td>
								<td><p>{{ $Mb2Gb(snapshot.size/1024/1024) }}</p></td>
								<td><p>{{ snapshot.hypervisor.name }}</p></td>
								<td><p>{{ snapshot.created_at }}</p></td>
								<td>
									<a class="btn btn-default" data-toggle="modal" data-target="#myModal" @click.prevent="restore(snapshot)"><i class="fas fa-sync"></i> Restore</a> &nbsp;
									<button class="btn btn-default" @click.prevent="destroy(snapshot.id)"><i class="fa fa-trash" aria-hidden="true"></i></button>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
					<pagination :search="pagination_search" :pagination="snapshots" @paginate="page"></pagination>
				</div>
				<div class="wow fadeIn blocks firewall-manage snapshots" v-else>
					<h1 class="text-center">No snapshots created!</h1>
				</div>
			</div>
		</div>
		<restoresnapshot :restoresnapshot="restore_snapshot" v-if="restore_snapshot.id && restore_snapshot.id !== ''" v-on:closeRestore="close_restore"></restoresnapshot>
	</div>
</template>
<script>
import restoresnapshot from '~/components/restoresnapshot.vue'
import pagination from '~/components/pagination.vue'
import Restoresnapshot from "@/components/restoresnapshot";

export default {
	watchQuery: true,
	head: {
		title: 'Snapshots'
	},
	components: {
		Restoresnapshot,
		pagination
	},
	layout: 'user',
	data() {
		return {
			getRoute: "user/snapshots",
			pagination_search: "",
			pagination_store: {no: 1, items: 20},
			snapshots: {
				total: 0,
				data: []
			},
			restore_snapshot: {}
		}
	},
	asyncData({$axios, route}) {
		let pagination_search = '';
		const pagination_store = {
			no: route.query.page ? route.query.page : 1,
			items: route.query.per_page ? route.query.per_page : 20,
		};
		if (route.query && route.query.search !== '') {
			pagination_search = route.query.search;
		}
		return $axios.get('user/snapshots', {
			params: {
				page: pagination_store.no,
				per_page: pagination_store.items,
				search: pagination_search
			}
		}).then((response) => {
			return {
				snapshots: response.data,
				pagination_search: pagination_search,
				pagination_store: pagination_store,
				getRoute: "user/snapshots"
			}
		}).catch((error) => {

		});
	},
	methods: {
		page(a, b, c = '') {
			this.$router.replace({
				name: this.$route.name, query: {
					page: a,
					per_page: b,
					search: c
				}
			})
		},
		search() {
			this.$router.replace({
				name: this.$route.name, query: {
					page: this.$route.query.page,
					per_page: this.$route.query.per_page,
					search: this.pagination_search
				}
			})
		},
		destroy(id) {
			let vm = this;
			bootbox.confirm({
				title: "Are you sure you want to delete this snapshot?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Delete Snapshot',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('user/snapshot/' + id).then((response) => {
							setTimeout(()=>{
								vm.search()
							},2000);

						}).catch((error) => {

						});
					}
				}
			});
		},
		update_name(snapshot, index) {
			this.$set(this.snapshots.data[index], "update_processing", true);
			this.$axios.patch('/user/snapshot/' + snapshot.id, { name: snapshot.name }).then((response) => {
				this.$set(this.snapshots.data[index], "update_processing", false);
				this.$set(this.snapshots.data[index], "editing", false);
			}).catch((error) => {
				this.$set(this.snapshots.data[index], "update_processing", false);
				this.$set(this.snapshots.data[index], "editing", true);
			});
		},
		restore(snapshot) {
			this.$set(this, "restore_snapshot", snapshot);
			setTimeout(() => {
				let modal = $('body').find('#snapshot-' + this.restore_snapshot.id);
				modal.modal('show')
			}, 100);
		},
		close_restore() {
			let modal = $('body').find('#snapshot-' + this.restore_snapshot.id);
			modal.modal('hide');
			this.$set(this, "restore_snapshot", {});
		},
	}
}
</script>
