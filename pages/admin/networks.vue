<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-server" aria-hidden="true"></i> Networks</h2>
		<div class="col-md-10 email networks">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.." v-model="network_pagination.search"
						   @keyup.enter="search">
				</div>
				<div class="pull-right createit">
					<nuxt-link tag="button" :to="{name: 'admin-network-create'}" class="btn btn-primary"><i
						class="fa fa-plus" aria-hidden="true"></i>&nbsp; Add network
					</nuxt-link>
					<nuxt-link tag="button" :to="{name: 'admin-ipv4-create'}" class="btn btn-primary"><i
						class="fa fa-plus" aria-hidden="true"></i>&nbsp; Add IPv4
					</nuxt-link>
					<nuxt-link tag="button" :to="{name: 'admin-ipv6-create'}" class="btn btn-primary"><i
						class="fa fa-plus" aria-hidden="true"></i>&nbsp; Add IPv6
					</nuxt-link>
				</div>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Name</th>
							<th>Gateway</th>
							<th>Netmask</th>
							<th>Used</th>
							<th>Free</th>
							<th>Hypervisors</th>
							<th>Added On</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="network in network_pagination.networks.data">
							<td>{{ network.name }}</td>
							<td>{{ network.gateway }}</td>
							<td>{{ network.netmask }}</td>
							<td>{{ network.used }}</td>
							<td>{{ network.free }}</td>
							<td>{{ network.hypervisors.length }}</td>
							<td>{{ network.created_at }}</td>
							<td class="actions">
								<nuxt-link tag="button" :to="{name: 'admin-network-id', params:{id: network.id}}"
										   class="btn btn-default"><i class="fa fa-edit" aria-hidden="true"></i>
								</nuxt-link>
								<nuxt-link tag="button" :to="{name: 'admin-network-id-ips', params:{id: network.id}}"
										   class="btn btn-default"><i class="fa fa-list" aria-hidden="true"></i>
								</nuxt-link>
								<button class="btn btn-default" @click.prevent="destroy(network)"><i class="fa fa-trash"
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
								aria-haspopup="true" aria-expanded="false"> {{ network_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: network_pagination.per_page === 20}"><a href="#"
																						 @click.prevent="$set($data.network_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: network_pagination.per_page === 50}"><a href="#"
																						 @click.prevent="$set($data.network_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: network_pagination.per_page === 100}"><a href="#"
																						  @click.prevent="$set($data.network_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> Page
							{{ network_pagination.networks.current_page }}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(network_pagination.networks.last_page)">
								<a href="#" @click.prevent="$set($data.network_pagination,'page',i)">
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
	head: {
		title: 'Networks'
	},
	watchQuery: true,
	watch: {
		'network_pagination.page': function () {
			this.search();
		},
		'network_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			network_pagination: {
				page: 1,
				per_page: 20,
				networks: {
					data: [],
					total: 0
				},
				search: ""
			}
		}
	},
	methods: {
		async search() {
			this.$router.replace({
				name: this.$route.name,
				query: {
					page: this.network_pagination.page,
					per_page: this.network_pagination.per_page,
					search: this.network_pagination.search
				}
			})
		},
		destroy(network) {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Are you sure you want to remove this Network?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove Network',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/admin/networks/' + network.id).then(async (response) => {
							await vm.$axios.get('/admin/networks', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.search ? vm.route.query.search : ''
								}
							}).then((response) => {
								vm.$set(vm.network_pagination, "networks", response.data);
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
		return $axios.get('/admin/networks', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				network_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					networks: response.data
				},
			}
		}).catch((error) => {
		})
	}
}
</script>
