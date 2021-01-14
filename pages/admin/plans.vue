<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-layer-group" aria-hidden="true"></i> Instance Plans</h2>
		<div class="col-md-10 email plans">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.." v-model="plan_pagination.search"
						   @keyup.enter="search">
				</div>
				<div class="pull-right">
					<nuxt-link tag="button" :to="{name: 'admin-plan-create'}" class="btn btn-primary createit"><i
						class="fa fa-plus" aria-hidden="true"></i>&nbsp;Create Plan
					</nuxt-link>
				</div>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Name</th>
							<th>Ram</th>
							<th>Disk</th>
							<th>Disk Type</th>
							<th>Bandwidth</th>
							<th>Hidden</th>
							<th>Sort</th>
							<th v-show="enabledBilling">Price</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="(plan,$index) in plan_pagination.plans.data">
							<td>{{ plan.name }}</td>
							<td>{{ $Mb2Gb(plan.ram) }}</td>
							<td>{{ plan.disk_size }}GB</td>
							<td>{{ $upperCase(plan.disk_type) }}</td>
							<td>{{ plan.bandwidth <= 0 ? 'No Limit' : $Gb2Tb(plan.bandwidth) }}</td>
							<td>
								<div>
									<input type="checkbox" :id="'is_hidden_'+plan.id" v-model="plan.hidden" @change.prevent="update_hidden(plan)" :checked="plan.hidden === 1"/>
									<label class="switchy" :for="'is_hidden_'+plan.id"></label>
								</div>
							</td>
							<td>
								<span v-if="!plan.editing">{{ plan.sort }} <i class="fas fa-edit" style="cursor:pointer" @click.prevent="$set($data.plan_pagination.plans.data[$index],'editing',true)"></i></span>
								<span v-if="plan.editing">
                                    <div class="col-lg-6">
                                        <div class="input-group">
                                            <input type="number" class="form-control" v-model="plan.sort">
                                            <div class="input-group-addon">
                                                <button class="btn" type="button"
														@click.prevent="update_sort(plan,$index)"
														:disabled="plan.update_processing">
                                                    <i class="fa fa-spin fa-spinner" v-if="plan.update_processing"></i>
                                                    <i class="fas fa-check" v-else></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </span>
							</td>
							<td v-if="enabledBilling">{{ $currencyFormat(plan.price) }}</td>
							<td class="actions">
								<nuxt-link tag="a" :to="{name: 'admin-plan-create', query: {duplicate: plan.id}}" class="btn btn-default">
									<i class="far fa-copy"></i>
								</nuxt-link>
								<nuxt-link tag="a" :to="{name: 'admin-plan-id', params:{id: plan.id}}" class="btn btn-default">
									<i class="fa fa-edit" aria-hidden="true"></i>
								</nuxt-link>
								<button class="btn btn-default" @click.prevent="destroy(plan)"><i class="fa fa-trash" aria-hidden="true"></i></button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="ipages">
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> {{ plan_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: plan_pagination.per_page === 20}"><a href="#"
																					  @click.prevent="$set($data.plan_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: plan_pagination.per_page === 50}"><a href="#"
																					  @click.prevent="$set($data.plan_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: plan_pagination.per_page === 100}"><a href="#"
																					   @click.prevent="$set($data.plan_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> Page {{
								plan_pagination.plans.current_page
							}}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(plan_pagination.plans.last_page)">
								<a href="#" @click.prevent="$set($data.plan_pagination,'page',i)">
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
		title: 'Instance Plans'
	},
	watch: {
		'plan_pagination.page': function () {
			this.search();
		},
		'plan_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			plan_pagination: {
				page: 1,
				per_page: 20,
				plans: {
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
					page: this.plan_pagination.page,
					per_page: this.plan_pagination.per_page,
					search: this.plan_pagination.search
				}
			})
		},
		update_hidden(plan) {
			this.$axios.patch('/admin/plans/' + plan.id + '/hidden', {hidden: plan.hidden});
		},
		update_sort(plan, index) {
			this.$set(this.plan_pagination.plans.data[index], "update_processing", true);
			this.$axios.patch('/admin/plans/' + plan.id + '/sort', {sort: plan.sort}).then((response) => {
				this.$set(this.plan_pagination.plans.data[index], "update_processing", false);
				this.$set(this.plan_pagination.plans.data[index], "editing", false);
			}).catch((error) => {
				this.$set(this.plan_pagination.plans.data[index], "update_processing", false);
				this.$set(this.plan_pagination.plans.data[index], "editing", true);
			});
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
						vm.$axios.delete('/admin/plans/' + plan.id).then(async (response) => {
							await vm.$axios.get('/admin/plans', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.search ? vm.route.query.search : ''
								}
							}).then((response) => {
								vm.$set(vm.plan_pagination, "plans", response.data);
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
		return $axios.get('/admin/plans', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				plan_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					plans: response.data
				},
			}
		}).catch((error) => {
		})
	}
}
</script>
