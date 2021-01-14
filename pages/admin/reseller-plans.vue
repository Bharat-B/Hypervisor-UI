<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-list" aria-hidden="true"></i> Reseller Plans</h2>
		<div class="col-md-10 email reseller_plans">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.."
						   v-model="reseller_plan_pagination.search" @keyup.enter="search">
				</div>
				<div class="pull-right">
					<nuxt-link tag="button" :to="{name: 'admin-reseller-plan-create'}" class="btn btn-primary createit">
						<i class="fa fa-plus" aria-hidden="true"></i>&nbsp;Create Plan
					</nuxt-link>
				</div>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Name</th>
							<th>CPU Cores</th>
							<th>RAM</th>
							<th>Disk</th>
							<th>Bandwidth</th>
							<th>Accounting</th>
							<th>Overage Action</th>
							<th>Users</th>
							<th v-show="enabledBilling">Price</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="reseller_plan in reseller_plan_pagination.reseller_plans.data">
							<td>{{ reseller_plan.name }}</td>
							<td>{{ reseller_plan.cpu_cores === 0 ? 'No Limit' : reseller_plan.cpu_cores }}</td>
							<td>{{ reseller_plan.ram === 0 ? 'No Limit' : $Mb2Gb(reseller_plan.ram) }}</td>
							<td>{{ reseller_plan.disk_size === 0 ? 'No Limit' : $Gb2Tb(reseller_plan.disk_size) }}</td>
							<td>{{ reseller_plan.bandwidth <= 0 ? 'No Limit' : $Gb2Tb(reseller_plan.bandwidth) }}</td>
							<td>{{ $ucfirst(reseller_plan.bandwidth_accounting) }}</td>
							<td>{{ bandwidth_overage[reseller_plan.bandwidth_overage] }}</td>
							<td>{{ reseller_plan.users.length }}</td>
							<td v-show="enabledBilling">{{ $currencyFormat(reseller_plan.price) }}</td>
							<td class="actions">
								<nuxt-link tag="a" :to="{name: 'admin-reseller-plan-create', query: {duplicate: reseller_plan.id}}" class="btn btn-default">
									<i class="far fa-copy"></i>
								</nuxt-link>
								<nuxt-link tag="a" :to="{name: 'admin-reseller-plan-id', params:{id: reseller_plan.id}}" class="btn btn-default">
									<i class="fa fa-edit" aria-hidden="true"></i>
								</nuxt-link>
								<button class="btn btn-default" @click.prevent="destroy(reseller_plan.id)"><i class="fa fa-trash" aria-hidden="true"></i></button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="ipages">
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> {{ reseller_plan_pagination.per_page }}
							entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: reseller_plan_pagination.per_page === 20}"><a href="#"
																							   @click.prevent="$set($data.reseller_plan_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: reseller_plan_pagination.per_page === 50}"><a href="#"
																							   @click.prevent="$set($data.reseller_plan_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: reseller_plan_pagination.per_page === 100}"><a href="#"
																								@click.prevent="$set($data.reseller_plan_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> Page
							{{ reseller_plan_pagination.reseller_plans.current_page }}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(reseller_plan_pagination.reseller_plans.last_page)">
								<a href="#" @click.prevent="$set($data.reseller_plan_pagination,'page',i)">
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
		title: 'Reseller Plans'
	},
	watch: {
		'reseller_plan_pagination.page': function () {
			this.search();
		},
		'reseller_plan_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			bandwidth_overage: {
				'suspend_network': "Suspend Network",
				'billing': "Billing",
				'suspend_instance': "Suspend Instance"
			},
			reseller_plan_pagination: {
				page: 1,
				per_page: 20,
				reseller_plans: {
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
					page: this.reseller_plan_pagination.page,
					per_page: this.reseller_plan_pagination.per_page,
					search: this.reseller_plan_pagination.search
				}
			})
		},
		destroy(plan) {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Are you sure you want to remove this Plan?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove Plan',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/admin/reseller-plans/' + plan).then(async (response) => {
							await vm.$axios.get('/admin/reseller-plans', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.search ? vm.route.query.search : ''
								}
							}).then((response) => {
								vm.$set(vm.reseller_plan_pagination, "reseller_plans", response.data);
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
		return $axios.get('/admin/reseller-plans', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				reseller_plan_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					reseller_plans: response.data
				},
			}
		}).catch((error) => {
		})
	}
}
</script>
