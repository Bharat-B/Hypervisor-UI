<template>
	<div class="dashcontent">
		<h1><i class="fa fa-server"></i> Instances</h1>
		<div class="dropdown manybtn">
			<button class="dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
					aria-expanded="false">
				<i class="fa fa-plus-circle" aria-hidden="true"></i> Create
				<span class="caret"></span>
			</button>
			<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
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
					<nuxt-link :to="{name: 'user-recipe-create'}">New Recipe</nuxt-link>
				</li>
				<li>
					<nuxt-link :to="{name: 'user-ssh-key-create'}">New SSH Key</nuxt-link>
				</li>
			</ul>
		</div>
		<div class="dashstuff instance-dashboard">
			<div class="row">
				<div class="col-md-8">
					<div class="wow fadeIn blocks instance" v-if="instances.data.length > 0">
						<input type="search" placeholder="Search Instances" v-model="pagination_search"
							   @keyup.enter="search"/>
						<br/>
						<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
							<div class="panel panel-default" v-for="(instance,$index) in instances.data">
								<a role="button" data-toggle="collapse" data-parent="#accordion"
								   :href="'#instance-'+instance.id" aria-expanded="false" aria-controls="collapseLast"
								   class="collapsed">
									<div class="panel-heading" role="tab" id="headinglast">
										<h4 class="panel-title name">
											<i class="fa fa-server" aria-hidden="true"></i>&nbsp; {{
												instance.hostname
											}} <span v-if="instance.user_id !== user.id">{{
												instance.user ? instance.user.email : ''
											}}</span>
											<div class="status">

                                                <span v-if="instance.created === 1" class="label" :class="{
                                                    'label-success': is_running(instance) && !is_suspended(instance),
                                                    'label-danger': is_stopped(instance) && !is_suspended(instance),
                                                    'label-default': unknown_suspended_state(instance) }">
                                                    {{ instance_status(instance) }}
                                                </span>
												<span v-else-if="instance.created === 0 && instance.running_task" class="label label-info">
													<i class="fa fa-spin fa-spinner"></i> Deploying
                                                </span>
												<span v-else-if="is_migrating(instance)" class="label label-info">
													<i class="fa fa-spin fa-spinner"></i> Migrating
                                                </span>
												<span v-else-if="instance.created === 0 && !instance.running_task" class="label label-danger">
                                                    Deploy Failed
                                                </span>
											</div>
										</h4>
									</div>
								</a>
								<div :id="'instance-'+instance.id" class="panel-collapse"
									 :class="{'collapse in': $index === 0, 'collapse': $index !== 0}" role="tabpanel"
									 aria-labelledby="headingLast">
									<div class="panel-body">
										<div class="row">
											<div class="col-md-3">
												<p><b>Disk</b>: {{ instance.disks[0].size }}GB </p>
												<p><b>CPU</b>: {{ instance.cpu_cores }}vCPUs</p>
											</div>
											<div class="col-md-3">
												<p><b>RAM</b>: {{ instance.ram / 1024 }}GB</p>
												<p><b>Location</b>: {{
														instance.hypervisor.region_id !== '' ? instance.hypervisor.region.length !== 0 ? instance.hypervisor.region[0].name + ', ' + instance.hypervisor.region[0].country : false : 'N/A'
													}}</p>
											</div>
											<div class="col-md-3">
												<p><b>OS</b>: {{ instance.os }}</p>
												<p><b>IP</b>: <span v-for="ip in instance.ips"
																	v-if="ip.type === 'public' && ip.primary === 1">{{
														ip.ip
													}}</span></p>
											</div>
											<div class="col-md-3">
												<a :href="'/user/instance/'+instance.id">
													<button class="btn btn-default"><i class="fas fa-sliders-h"
																					   aria-hidden="true"></i> Manage
													</button>
												</a>
											</div>
										</div>
										<div class="newinstancecreation"
											 v-if="instance.created === 0 && ['create_instance','rebuild_instance'].indexOf(task.action) !== -1"
											 v-for="task in instance.tasks" :id="'task-'+task.id">
											<div class="progress">
												<div class="progress-bar progress-bar-striped active" role="progressbar"
													 :aria-valuenow="task.progress" aria-valuemin="0"
													 aria-valuemax="100" :style="'width: '+task.progress+'%'">
													<p class="less">{{ tasks[task.action] }} {{ task.progress }}%</p>
													<span class="sr-only">{{ task.progress }}%</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<pagination :search="pagination_search" :pagination="instances" @paginate="page"></pagination>
					</div>
					<div class="wow fadeIn blocks instance" v-else>
						<h1 class="text-center">No Instances deployed!</h1>
					</div>
					<br/>
				</div>
				<div class="col-md-4">
					<div class="wow fadeIn blocks wb">
						<h5>Welcome back, <a href="/profile"><b>{{ user.first_name }}</b></a>! <i class="far fa-smile"
																								  aria-hidden="true"></i>
						</h5>
						<p class="text-center">You have</p>
						<div class="circlestats">
							<b> <span class="budget">{{ instances.total }}</span></b> <br/>
							instances
						</div>
						<div class="circlestats" v-if="enabledBilling">
							<b> <span class="budget">{{ $currencyFormat(user.credit) }}</span></b> <br/>
							credits
						</div>
						<div class="circlestats" v-if="enabledBilling">
							<b> <span class="budget">{{ $currencyFormat(user.debit) }}</span></b> <br/>
							charges
						</div>
					</div>
					<br/>
					<div class="wow fadeIn blocks logs">
						<h3>Account Activity</h3>
						<ul>
							<li v-for="activity in user.activity"><p><span><i class="fas fa-circle"
																			  aria-hidden="true"></i> {{
									activity.event
								}} from:
                            {{ activity.ip }}</span> &nbsp; <b class="less"><i class="far fa-clock"
																			   aria-hidden="true"></i>
								{{ activity.created_at }} </b></p></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import pagination from '~/components/pagination.vue'

export default {
	watchQuery: true,
	layout: 'user',
	head: {
		title: 'Dashboard'
	},
	components: {
		pagination
	},
	data() {
		return {
			pagination_search: "",
			pagination_store: {no: 1, items: 20},
			instances: {
				data: [],
				total: 0
			},
			instance_statuses: {
				'1': 'Running',
				'0': 'Stopped',
				'2': 'Suspended'
			},
			polling: null,
			poll_tasks: [],
			tasks: {
				create_instance: 'Deploying',
				rebuild_instance: 'Re-Deploying',
				start_instance: 'Booting',
				stop_instance: 'Powering Off',
				shutdown_instance: 'Shutting Down',
				restart_instance: 'Rebooting',
				destroy_instance: 'Destroying Instance'
			},
		}
	},
	async asyncData({$axios, route}) {
		let pagination_search = '';
		const pagination_store = {
			no: route.query.page ? route.query.page : 1,
			items: route.query.per_page ? route.query.per_page : 20,
		};
		if (route.query && route.query.search !== '') {
			pagination_search = route.query.search;
		}
		return await $axios.get('user/instances', {
			params: {
				page: pagination_store.no,
				per_page: pagination_store.items,
				search: pagination_search
			}
		}).then((response) => {
			return {
				instances: response.data,
				pagination_search: pagination_search,
				pagination_store: pagination_store
			}
		}).catch((error) => {

		});
	},
	methods: {
		async search() {
			this.$router.replace({
				name: this.$route.name, query: {
					page: this.$route.query.page,
					per_page: this.$route.query.per_page,
					search: this.pagination_search
				}
			})
		},
		page(a, b, c = '') {
			this.$router.replace({
				name: this.$route.name, query: {
					page: a,
					per_page: b,
					search: c
				}
			})
		},
		do_polling() {
			let vm = this;
			vm.instances.data.forEach((instance, ik) => {
				if (instance.tasks.length >= 1) {
					instance.tasks.forEach((task, k) => {
						if (['done', 'failed'].indexOf(task.status) === -1) {
							vm.poll_tasks[k] = task.id;
							vm.$set(vm.instances.data[ik], "running_task", true);
						}
					});
				}
			});
			clearInterval(vm.polling);
			vm.polling = setInterval(() => {
				vm.update_tasks();
			}, 1000);
		},
		async update_tasks() {
			let vm = this, end = ['done', 'failed'];
			if (vm.poll_tasks.length >= 1) {
				let response = await vm.$axios.get('/user/tasks', {
					params: {
						tasks: vm.poll_tasks.join(',')
					}
				}).catch((error) => {

				});
				response.data.forEach((task) => {
					vm.instances.data.forEach((instance, ik) => {
						if (instance.id === task.instance_id) {
							vm.poll_tasks.forEach(async (task_id, tk) => {
								if (task_id === task.id) {
									vm.$set(vm.instances.data[ik].tasks, tk, task);
									if ($.inArray(task.status, end) !== -1) {
										let response = await vm.$axios.get('/user/instances/' + task.instance_id).catch((error) => {
										});
										vm.poll_tasks.splice(vm.poll_tasks.index(task_id), 1);
										vm.$set(vm.instances.data[ik], "running_task", false);
										vm.$set(vm.instances.data, ik, response.data);
									}
								}
							});
						}
					});
				});
			}
			if (vm.poll_tasks.length <= 0) {
				clearInterval(vm.polling);
			}
		},
		instance_status(instance) {
			if (instance.suspended > 0) {
				return 'Suspended'
			} else if (instance.network_suspended > 0) {
				return 'Network Suspended'
			} else {
				return this.instance_statuses[instance.status.status];
			}
		},
		is_migrating(instance){
			return instance.migration && instance.migration.id;
		},
		is_running(instance) {
			return instance.status && instance.status.status === 1;
		},
		is_stopped(instance) {
			return instance.status && instance.status.status === 0;
		},
		is_suspended(instance) {
			return instance.suspended === 1;
		},
		is_network_suspended(instance) {
			return instance.suspended_network === 1;
		},
		unknown_suspended_state(instance) {
			return instance.status && instance.status.status === 2 || instance.suspended === 2;
		}
	},
	mounted() {
		let vm = this;
		$('.budget').each(function () {
			var el = $(this);
			var textLength = el.html().length;
			if (textLength > 3) {
				el.css('font-size', '17px');
			}
		});
		$('.budget').each(function () {
			var el = $(this);
			var textLength = el.html().length;
			if (textLength > 4) {
				el.css('font-size', '14px');
			}
		});
		$('.budget').each(function () {
			var el = $(this);
			var textLength = el.html().length;
			if (textLength > 5) {
				el.css('font-size', '13px');
			}
		});
		$('.budget').each(function () {
			var el = $(this);
			var textLength = el.html().length;
			if (textLength > 6) {
				el.css('font-size', '11px');
			}
		});
		new WOW().init(
			{
				boxClass: 'wow',
				animateClass: 'animated',
				offset: 0,
				mobile: false,
				live: true
			}
		);
		vm.do_polling();
	},
	beforeDestroy() {
		clearInterval(this.polling);
	},
	computed: {


	}
}
</script>
