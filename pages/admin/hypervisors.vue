<template>
	<div class="content animated fadeIn">
		<h2><i aria-hidden="true" class="fa fa-server"></i> Hypervisors</h2>
		<div class="col-md-12 email hypervisors">
			<div class="box">
				<div class="input-group">
					<input v-model="hypervisor_pagination.search" class="form-control" placeholder="Search.."
						   type="text"
						   @keyup.enter="search">
				</div>
				<nuxt-link :to="{name: 'admin-hypervisor-create'}" class="btn btn-primary createit"><i
					aria-hidden="true"
					class="fa fa-plus"></i>&nbsp;
					Add Hypervisor
				</nuxt-link>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Status</th>
							<th>Name</th>
							<th>IP</th>
							<th>Ram</th>
							<th>Uptime</th>
							<th>Bandwidth</th>
							<th>OS</th>
							<th>Regions</th>
							<th>License Status</th>
							<th>License Type</th>
							<th>License Expires On</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="(hypervisor,$index) in hypervisor_pagination.hypervisors.data">
							<td>
								<div :class="{active: hypervisor.status === 1, inactive: hypervisor.status === 0}"
									 class="status"></div>
							</td>
							<td>{{ hypervisor.name }}</td>
							<td>{{
									hypervisor.private_ip !== '' ? [hypervisor.ip, hypervisor.private_ip].join(' / ') : hypervisor.ip
								}}
							</td>
							<td>{{ $ram(hypervisor.used_ram) }} / {{ $ram(hypervisor.ram) }}</td>
							<td>{{ hypervisor.uptime }}</td>
							<td>{{ $Gb2Tb(hypervisor.used_bandwidth) }} / {{ $Gb2Tb(hypervisor.bandwidth) }}</td>
							<td><img :src="'/assets/'+hypervisor.os+'.png'"/></td>
							<td>{{ hypervisor.region.length }}</td>
							<td v-if="!hypervisor.hypervisor_license.error">
								{{ $ucfirst(hypervisor.hypervisor_license.status) }}
							</td>
							<td v-if="!hypervisor.hypervisor_license.error">{{
									hypervisor.hypervisor_license.licnumvs === '-1' ? 'Unlimited' : hypervisor.hypervisor_license.licnumvs + ' Instance(s)'
								}}
							</td>
							<td v-if="!hypervisor.hypervisor_license.error">{{
									hypervisor.hypervisor_license.expires_on
								}}
							</td>
							<td v-if="hypervisor.hypervisor_license.error">Inactive</td>
							<td v-if="hypervisor.hypervisor_license.error">N/A</td>
							<td v-if="hypervisor.hypervisor_license.error">N/A</td>
							<td class="actions">
								<button class="btn btn-default" @click.prevent="refresh_hypervisor(hypervisor,$index)"><i
									aria-hidden="true" class="fa fa-sync"></i></button>
								<nuxt-link :to="{name: 'admin-hypervisor-id', params:{id: hypervisor.id}}" class="btn btn-default"
										   tag="button"><i aria-hidden="true" class="fa fa-edit"></i>
								</nuxt-link>
								<button class="btn btn-default" @click.prevent="destroy(hypervisor)"><i
									aria-hidden="true" class="fa fa-trash"></i></button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="ipages">
					<div class="btn-group dropup">
						<button aria-expanded="false" aria-haspopup="true" class="btn btn-default dropdown-toggle"
								data-toggle="dropdown"
								type="button"> {{ hypervisor_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: hypervisor_pagination.per_page === 20}"><a href="#"
																							@click.prevent="$set($data.hypervisor_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: hypervisor_pagination.per_page === 50}"><a href="#"
																							@click.prevent="$set($data.hypervisor_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: hypervisor_pagination.per_page === 100}"><a href="#"
																							 @click.prevent="$set($data.hypervisor_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button aria-expanded="false" aria-haspopup="true" class="btn btn-default dropdown-toggle"
								data-toggle="dropdown"
								type="button"> Page {{ hypervisor_pagination.hypervisors.current_page }}
							<i aria-hidden="true" class="fa fa-arrow-circle-up"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(hypervisor_pagination.hypervisors.last_page)">
								<a href="#" @click.prevent="$set($data.hypervisor_pagination,'page',i)">
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
		title: 'Hypervisors'
	},
	watchQuery: true,
	watch: {
		'hypervisor_pagination.page': function () {
			this.search();
		},
		'hypervisor_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			hypervisor_pagination: {
				page: 1,
				per_page: 20,
				hypervisors: {
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
				name: this.$route.name, query: {
					page: this.hypervisor_pagination.page,
					per_page: this.hypervisor_pagination.per_page,
					search: this.hypervisor_pagination.search
				}
			})
		},
		refresh_hypervisor(hypervisor,index) {
			let vm = this;
			vm.$axios.get('/admin/hypervisors/' + hypervisor.id).then((response) => {
				vm.hypervisor_pagination.hypervisors.data[index] = response.data;
			}).catch(() => {

			});
		},
		destroy(hypervisor) {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Are you sure you want to remove this Hypervisor?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove Hypervisor',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/admin/hypervisors/' + hypervisor.id, {params: {force: true}}).then(async (response) => {
							await vm.$axios.get('/admin/hypervisors', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.search ? vm.route.query.search : ''
								}
							}).then((response) => {
								vm.$set(vm.hypervisor_pagination, "hypervisors", response.data);
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
		return $axios.get('/admin/hypervisors', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				hypervisor_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					hypervisors: response.data
				},
			}
		}).catch((error) => {
		})
	}
}
</script>
