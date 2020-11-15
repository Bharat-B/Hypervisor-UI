<template>
	<div class="content animated fadeIn">
		<h2><i class="fas fa-hdd" aria-hidden="true"></i> Storage</h2>
		<div class="col-md-10 email">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.." v-model="storage_pagination.search"
						   @keyup.enter="search">
				</div>
				<nuxt-link :to="{name: 'admin-storage-create'}">
					<button class="btn btn-primary createit"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp; Create
						Storage
					</button>
				</nuxt-link>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Name</th>
							<th>Path</th>
							<th>Type</th>
							<th>Format</th>
							<th>Size</th>
							<th>Available</th>
							<th>Disk</th>
							<th>Added On</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="storage in storage_pagination.storages.data">
							<td>{{ storage.name }}</td>
							<td>{{ storage.path }}</td>
							<td>{{ $upperCase(storage.type) }}</td>
							<td>{{ $upperCase(storage.format) }}</td>
							<td>{{ $Gb2Tb(storage.size) }}</td>
							<td>{{ $Gb2Tb(storage.free) }}</td>
							<td>{{ $upperCase(storage.disk_type) }}</td>
							<td>{{ storage.created_at }}</td>
							<td class="actions">
								<nuxt-link :to="{name: 'admin-storage-id', params: { id: storage.id }}" tag="button"
										   class="btn btn-default"><i class="far fa-edit" aria-hidden="true"></i>
								</nuxt-link>
								&nbsp;
								<button class="btn btn-default" @click.prevent="destroy(storage)"><i class="fa fa-trash"
																									 aria-hidden="true"></i>
								</button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="ipages">
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> {{ storage_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: storage_pagination.per_page === 20}"><a href="#"
																						 @click.prevent="$set($data.storage_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: storage_pagination.per_page === 50}"><a href="#"
																						 @click.prevent="$set($data.storage_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: storage_pagination.per_page === 100}"><a href="#"
																						  @click.prevent="$set($data.storage_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> Page
							{{ storage_pagination.storages.current_page }}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(storage_pagination.storages.last_page)">
								<a href="#" @click.prevent="$set($data.storage_pagination,'page',i)">
									{{ i }}
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	watchQuery: true,
	head: {
		title: 'Storages'
	},
	watch: {
		'storage_pagination.page': function () {
			this.search();
		},
		'storage_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			storage_pagination: {
				page: 1,
				per_page: 20,
				storages: {
					data: [],
					total: 0
				},
				search: ""
			},
		}
	},
	methods: {
		async search() {
			this.$router.replace({
				name: this.$route.name, query: {
					page: this.storage_pagination.page,
					per_page: this.storage_pagination.per_page,
					search: this.storage_pagination.search
				}
			})
		},
		destroy(storage) {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Are you sure you want to remove this Storage?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove Storage',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/admin/storages/' + storage.id).then(async (response) => {
							await vm.$axios.get('/admin/storages', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.search ? vm.route.query.search : ''
								}
							}).then((response) => {
								vm.$set(vm.storage_pagination, "storages", response.data);
							})
						}).catch((error) => {
							vm.processing = false;
						});
					}
					vm.processing = false;
				}
			});
		}
	},
	asyncData({$axios, route}) {
		return $axios.get('/admin/storages', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				storage_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					storages: response.data
				},
			}
		}).catch((error) => {

		})
	},
	mounted() {

	}
}
</script>
