<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-map-marker" aria-hidden="true"></i> Regions</h2>
		<div class="col-md-10 email hypervisors">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.." v-model="region_pagination.search"
						   @keyup.enter="search">
				</div>
				<nuxt-link tag="button" :to="{name: 'admin-region-create'}" class="btn btn-primary createit"><i
					class="fa fa-plus" aria-hidden="true"></i>&nbsp; Create Region
				</nuxt-link>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Name</th>
							<th>Country</th>
							<th>Hypervisors</th>
							<th>Plans</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="region in region_pagination.regions.data">
							<td>{{ region.name }}</td>
							<td>{{ region.country }}</td>
							<td>{{ region.hypervisors.length }}</td>
							<td>{{ region.plans.length }}</td>
							<td class="actions">
								<nuxt-link :to="{name: 'admin-region-id', params: {id: region.id}}" tag="button"
										   class="btn btn-default"><i class="fa fa-edit" aria-hidden="true"></i>
								</nuxt-link>
								<button class="btn btn-default"><i class="fa fa-trash" aria-hidden="true"></i></button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="ipages">
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> {{ region_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: region_pagination.per_page === 20}"><a href="#"
																						@click.prevent="$set($data.region_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: region_pagination.per_page === 50}"><a href="#"
																						@click.prevent="$set($data.region_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: region_pagination.per_page === 100}"><a href="#"
																						 @click.prevent="$set($data.region_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> Page
							{{ region_pagination.regions.current_page }}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(region_pagination.regions.last_page)">
								<a href="#" @click.prevent="$set($data.region_pagination,'page',i)">
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
		title: 'Regions'
	},
	watch: {
		'region_pagination.page': function () {
			this.search();
		},
		'region_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			region_pagination: {
				page: 1,
				per_page: 20,
				regions: {
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
				name: this.$route.name,
				query: {
					page: this.region_pagination.page,
					per_page: this.region_pagination.per_page,
					search: this.region_pagination.search
				}
			})
		},
		destroy(region) {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Are you sure you want to remove this Region?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove Region',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/admin/regions/' + region.id).then(async (response) => {
							await vm.$axios.get('/admin/regions', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.search ? vm.route.query.search : ''
								}
							}).then((response) => {
								vm.$set(vm.region_pagination, "regions", response.data);
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
		return $axios.get('/admin/regions', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				region_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					regions: response.data
				},
			}
		}).catch((error) => {

		})
	},
	mounted() {

	}
}
</script>
