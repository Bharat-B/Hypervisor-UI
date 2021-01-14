<template>
	<div class="dashcontent">
		<h1><i class="fa fa-users" aria-hidden="true"></i> Subusers</h1>
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
					<nuxt-link :to="{name: 'user-snapshot-create'}">New snapshot</nuxt-link>
				</li>
				<li>
					<nuxt-link :to="{name: 'user-ssh-key-create'}">New SSH Key</nuxt-link>
				</li>
			</ul>
		</div>
		<div class="dashstuff">
			<div class="col-md-10">
				<div class="wow fadeIn blocks firewall-manage snapshots" v-if="subusers.data.length >= 1">
					<input type="search" placeholder="Search User" v-model="pagination_search" @keyup.enter="search"/>
					<br><br>
					<div class="table-responsive">
						<table class="table snapshotslist">
							<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Status</th>
								<th>Data created</th>
								<th></th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="subuser in subusers.data">
								<td>{{ subuser.first_name }} {{ subuser.last_name }}</td>
								<td>{{ subuser.email }}</td>
								<td>
									<div class="status" :class="{active: subuser.status === 1, inactive: subuser.status === 0, suspended: subuser.status === 2}"></div>
								</td>
								<td>{{ subuser.created_at }}</td>
								<td class="actions">
									<button class="btn btn-default" @click.prevent="destroy(subuser.id)" :disabled="subuser.email === user.email">
										<i class="fa fa-trash" aria-hidden="true"></i>
									</button>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
					<pagination :search="pagination_search" :pagination="subusers" @paginate="page"></pagination>
				</div>
				<div class="wow fadeIn blocks firewall-manage snapshots" v-else>
					<h1 class="text-center">No users created!</h1>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import pagination from '~/components/pagination.vue'

export default {
	watchQuery: true,
	head: {
		title: 'Sub Users'
	},
	components: {
		pagination
	},
	layout: 'user',
	data() {
		return {
			getRoute: "/user/reseller/subusers",
			pagination_search: "",
			pagination_store: {no: 1, items: 20},
			subusers: {
				total: 0,
				data: []
			}
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
		return $axios.get('/user/reseller/subusers', {
			params: {
				page: pagination_store.no,
				per_page: pagination_store.items,
				search: pagination_search
			}
		}).then((response) => {
			return {
				subusers: response.data,
				pagination_search: pagination_search,
				pagination_store: pagination_store,
				getRoute: "/user/reseller/subusers"
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
				title: "Are you sure you want to delete this subuser?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Delete Subuser',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/user/reseller/subuser/' + id).then((response) => {
							setTimeout(()=>{
								vm.search()
							},2000);
						}).catch((error) => {

						});
					}
				}
			});
		}
	}
}
</script>
