<template>
	<div class="content animated fadeIn instance">
		<h2><i aria-hidden="true" class="fa fa-th-large"></i> Instances</h2>
		<div class="col-md-12 email instances">
			<div class="box">
				<div class="input-group">
					<input v-model="instance_pagination.search" class="form-control" placeholder="Search.." type="text"
						   @keyup.enter="search">
				</div>
				<div class="createit">
					<nuxt-link :to="{name: 'admin-instance-create'}" class="btn btn-primary" tag="a"><i
						aria-hidden="true" class="fa fa-plus"></i>&nbsp;
						Add Instance
					</nuxt-link>
					<nuxt-link :to="{name: 'admin-instance-migrate'}" class="btn btn-primary" tag="a"><i
						aria-hidden="true" class="fa fa-exchange-alt"></i>&nbsp;
						Migrate Instance
					</nuxt-link>
				</div>
				<br/><br/>
				<div class="row">
					<div class="col-lg-3">
						<label>Hypervisor</label>
						<select class="form-control" data-width="100%" name="hypervisor_id">
							<option value=""></option>
						</select>
					</div>
					<div class="col-lg-3">
						<label>Status</label>
						<select class="form-control" data-width="100%" name="status">
							<option value=""></option>
						</select>
					</div>
				</div>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th></th>
							<th>Status</th>
							<th>Name</th>
							<th>Hostname</th>
							<th>IP</th>
							<th>OS</th>
							<th>Hypervisor</th>
							<th>User</th>
							<th>Manage</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="(instance, $index) in instance_pagination.instances.data">
							<td>
								<label :class="{disabled: instance.running_task}" class="check">
									<input v-model="instance.selected" type="checkbox"
										   @change.prevent="select_instance(instance,$index)">
									<span class="checkmark"></span>
								</label>
							</td>
							<td>
								<span v-if="instance.created === 1 && !instance.running_task" :class="{'label-success': is_running(instance) && !is_suspended(instance),'label-danger': is_stopped(instance) && !is_suspended(instance),'label-default': unknown_suspended_state(instance),'label-warning': is_suspended (instance) || is_network_suspended(instance)}" class="label">
									{{ instance_status(instance) }}
								</span>
								<span v-else-if="( instance.created === 0 || instance.created === 1 ) && instance.running_task">
									<span v-for="task in instance.tasks" v-if="['done','failed'].indexOf(task.status) === -1" class="label label-info">
										<i class="fa fa-spin fa-spinner"></i> {{ tasks[task.action] }}
									</span>
								</span>
								<span v-else-if="instance.created === 0 && !instance.running_task" class="label label-danger">Deploy Failed</span>
								<span v-else-if="is_migrating(instance)" class="label label-info"><i class="fa fa-spin fa-spinner"></i> Migrating</span>
								<span v-else class="label label-info"><i class="fa fa-spin fa-spinner"></i> Retrieving Status</span>
							</td>
							<td>{{ instance.name }}</td>
							<td>{{ instance.hostname }}</td>
							<td>{{ instance.ips.length >= 1 && instance.primary_ip.length >= 1 ? instance.primary_ip[0].ip : '' }}</td>
							<td><img :src="'/assets/'+instance.os_distro+'.png'" style="height:32px;width:32px"/></td>
							<td>{{ instance.hypervisor ? instance.hypervisor.name : '' }}</td>
							<td>{{ instance.user ? instance.user.email : '' }}</td>
							<td>
								<nuxt-link :disabled="instance.processing"
										   :to="{name: 'admin-instance-id', params: {id: instance.id}}"
										   class="btn btn-default" data-placement="bottom" data-title="Edit"
										   data-toggle="tooltip" tag="a"><i class="fa fa-edit"></i></nuxt-link>
								<nuxt-link :disabled="instance.processing"
										   :to="{name: 'admin-instance-id-manage', params: {id: instance.id}}"
										   class="btn btn-default" data-placement="bottom" data-title="Manage"
										   data-toggle="tooltip" tag="a"><i class="fa fa-cog"></i></nuxt-link>
							</td>
							<td class="actions responsiveness">
								<button v-if="is_stopped(instance) && !is_suspended(instance) && !is_network_suspended(instance)"
									:disabled="instance.processing || instance.running_task || is_migrating(instance)" class="btn btn-default"
									data-placement="bottom" data-title="Start" data-toggle="tooltip"
									@click.prevent="action('start', instance, $index)"><i class="fa fa-power-off"
																						  style="color: #56A26C"></i>
								</button>
								<button v-if="is_running(instance) && !is_suspended(instance)"
										:disabled="instance.processing || instance.running_task || is_migrating(instance)" class="btn btn-default"
										data-placement="bottom" data-title="Suspend" data-toggle="tooltip"
										@click.prevent="action('suspend', instance, $index)"><i class="fa fa-pause"></i>
								</button>
								<button v-if="is_running(instance) && !is_suspended(instance) && !is_network_suspended(instance)"
									:disabled="instance.processing || instance.running_task || is_migrating(instance)" class="btn btn-default"
									data-placement="bottom" data-title="Shutdown" data-toggle="tooltip"
									@click.prevent="action('shutdown', instance, $index)"><i class="fa fa-stop"
																							 style="color: #c9302c"></i>
								</button>
								<button v-if="!is_suspended(instance) && !is_network_suspended(instance)"
										:disabled="instance.processing || instance.running_task || is_migrating(instance)" class="btn btn-default"
										data-placement="bottom" data-title="Restart" data-toggle="tooltip"
										@click.prevent="action('restart', instance, $index)"><i class="fa fa-sync"
																								style="color: #31b0d5"></i>
								</button>
								<button v-if="is_running(instance) && !is_suspended(instance)"
										:disabled="instance.processing || instance.running_task || is_migrating(instance)" class="btn btn-default"
										data-placement="bottom" data-title="Power Off" data-toggle="tooltip"
										@click.prevent="action('stop', instance, $index)"><i class="fa fa-power-off"
																							 style="color: #c9302c"></i>
								</button>
								<button v-if="is_suspended(instance)"
										:disabled="instance.processing || instance.running_task || is_migrating(instance)" class="btn btn-default"
										data-placement="bottom" data-title="Resume" data-toggle="tooltip"
										@click.prevent="action('resume', instance, $index)"><i class="fa fa-play"
																							   style="color: #56A26C"></i>
								</button>
								<button class="btn btn-default" data-placement="bottom" data-title="Open Console"
										data-toggle="tooltip" @click.prevent="novnc(instance)"><i aria-hidden="true"
																								  class="fa fa-terminal"></i>
								</button>
								<button :disabled="instance.processing || instance.running_task || is_migrating(instance)" class="btn btn-default"
										data-placement="bottom" data-title="Destroy" data-toggle="tooltip"
										@click.prevent="destroy(instance, $index)"><i aria-hidden="true"
																					  class="fa fa-trash"></i></button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="ipages">
					<div class="btn-group">
						<select class="form-control" data-width="100%" name="action" @change.prevent="do_mass_action">
							<option value="">Select Action</option>
							<option value="start">Start</option>
							<option value="stop">Stop</option>
							<option value="shutdown">Poweroff</option>
							<option value="suspend">Suspend</option>
							<option value="resume">Resume</option>
							<option value="suspend_network">Suspend Network</option>
							<option value="resume_network">Resume Network</option>
							<option value="destroy">Destroy</option>
						</select>
					</div>
					<div class="btn-group dropup">
						<button aria-expanded="false" aria-haspopup="true" class="btn btn-default dropdown-toggle"
								data-toggle="dropdown"
								type="button"> {{ instance_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: instance_pagination.per_page === 20}"><a href="#"
																						  @click.prevent="$set($data.instance_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: instance_pagination.per_page === 50}"><a href="#"
																						  @click.prevent="$set($data.instance_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: instance_pagination.per_page === 100}"><a href="#"
																						   @click.prevent="$set($data.instance_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button aria-expanded="false" aria-haspopup="true" class="btn btn-default dropdown-toggle"
								data-toggle="dropdown"
								type="button"> Page {{ instance_pagination.instances.current_page }}
							<i aria-hidden="true" class="fa fa-arrow-circle-up"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(instance_pagination.instances.last_page)">
								<a href="#" @click.prevent="$set($data.instance_pagination,'page',i)">
									{{ i }}
								</a>
							</li>
						</ul>
					</div>
				</div>
				<br>
			</div>
		</div>
	</div>
</template>
<script>

export default {
	layout: 'admin',
	watchQuery: true,
	head: {
		title: 'Instances'
	},
	watch: {
		'filter': {
			handler: function () {
				this.search();
			},
			deep: true
		},
		'instance_pagination.page': function () {
			this.search();
		},
		'instance_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			instance_pagination: {
				page: 1,
				per_page: 20,
				instances: {
					data: [],
					total: 0
				},
				search: ""
			},
			instance_statuses: {
				'1': 'Running',
				'0': 'Stopped',
				'2': 'Suspended',
				'5': 'Suspended'
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
				destroy_instance: 'Destroying',
				resume_instance: 'Resuming',
				suspend_instance: 'Suspending'
			},
			initiated: [],
			selected_instances: [],
			filter: {
				status: '',
				hypervisor_id: ''
			},
			status: [
				{id: 'running', text: 'Running'},
				{id: 'stopped', text: 'Stopped'},
				{id: 'suspended', text: 'Suspended'},
				{id: 'suspended_network', text: 'Network Suspended'},
				{id: 'deploy_failed', text: 'Deploy Failed'}
			],
			hypervisor: []
		}
	},
	methods: {
		async search() {
			this.$router.push({
				name: this.$route.name, query: {
					page: this.instance_pagination.page,
					per_page: this.instance_pagination.per_page,
					search: this.instance_pagination.search,
					...this.filter
				}
			})
		},
		novnc(instance) {
			this.$axios.get('/admin/instance/' + instance.id + '/novnc').then((response) => {
				var x = window.open('', '', 'height=768px,width=1024px');
				x.document.open();
				x.document.write(response.data);
				x.document.close();
			});
		},
		destroy(instance, index) {
			let vm = this;
			bootbox.confirm({
				title: "Are you sure you want to remove this Instance?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove Instance',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.action('destroy', instance, index);
					}
				}
			});
		},
		instance_status(instance) {
			if (instance.suspended === 1) {
				return 'Suspended'
			} else if (instance.suspended_network === 1) {
				return 'Network Suspended'
			} else {
				return this.instance_statuses[instance.status.status];
			}
		},
		select_instance(instance, index) {
			if (instance.selected) {
				if (this.selected_instances.indexOf(instance.id) === -1) {
					this.selected_instances[index] = instance.id;
				}
			} else {
				if (this.selected_instances.indexOf(instance.id) !== -1) {
					this.selected_instances.splice(this.selected_instances.indexOf(instance.id), 1);
				}
			}
		},
		disableAction(instance) {
			return (instance.noaction || instance.processing || instance.running_task || instance.running_task && instance.created === 0)
		},
		is_running(instance) {
			return instance.status && instance.status.status === 1;
		},
		is_migrating(instance) {
			return instance.migration && instance.migration.id;
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
		},

		do_mass_action() {
			let vm = this, action = $('[name="action"]').val();
			vm.$store.dispatch('clearAlerts', {has: false});
			if (vm.selected_instances.length <= 0) {
				vm.$store.dispatch('setAlerts', {
					has: true,
					type: 'error',
					position: 'top',
					message: "Please select at least one instance!"
				});
				return;
			}
			if (action !== '') {
				bootbox.confirm({
					title: "Are you sure you want to perform this action?",
					message: "Please do no refresh this page until the operation is completed!.",
					buttons: {
						confirm: {
							label: '<i class="fa fa-check"></i> Ok',
							className: 'btn-success'
						},
						cancel: {
							label: 'Cancel',
							className: 'btn-warning'
						}
					},
					callback: function (result) {
						if (result) {
							clearInterval(this.polling);
							vm.selected_instances.forEach(async (instance, k) => {
								vm.$set(vm.instance_pagination.instances.data[k], 'processing', true);
								vm.$axios.post('/admin/instance/' + instance, {action: action}).then((response) => {
									if (response && response.data.task_id) {
										vm.initiated.push(response.data.task_id);
									}
								}).catch((error) => {
									vm.$set(vm.instance_pagination.instances.data[k], 'processing', false);
								});
							});
							setTimeout(() => {
								vm.get_instances();
							}, 10000);
						}
					}
				});
			}
		},

		async action(action, instance, index) {
			this.$set(this.instance_pagination.instances.data[index], 'processing', true);
			let result = await this.$axios.post('/admin/instance/' + instance.id, {action: action}).catch((error) => {
				this.$set(this.instance_pagination.instances.data[index], 'processing', false);
			});
			if (result && result.data.task_id) {
				this.initiated.push(result.data.task_id);
			}
			setTimeout(() => {
				this.get_instances();
			}, 1000);
		},

		async get_instances() {

			let response = await this.$axios.get('/admin/instances', {
				params: {
					page: this.$route.query.page ? this.$route.query.page : 1,
					per_page: this.$route.query.per_page ? this.$route.query.per_page : 20,
					search: this.$route.query.search ? this.$route.query.search : '',
					status: this.$route.query.status,
					hypervisor_id: this.$route.query.hypervisor_id
				}
			});

			this.$set(this, 'instance_pagination', {
				search: this.$route.query.search,
				page: this.$route.query.page ? this.$route.query.page : 1,
				per_page: this.$route.query.per_page ? this.$route.query.per_page : 20,
				instances: response.data
			});

			this.$set(this, 'filter', {
				status: this.$route.query.status,
				hypervisor_id: this.$route.query.hypervisor_id
			});

			this.do_polling();

		},

		ip_list(instance) {
			let ips = [];
			instance.ips.forEach((ip) => {
				if (instance.primary_ip.length > 0 && instance.primary_ip[0].ip === ip.ip) {
					return;
				}
				ips.push(ip.ip)
			});
			return ips.join('<br />');
		},

		do_polling() {
			clearInterval(this.polling);
			let vm = this, tasks = [];
			vm.instance_pagination.instances.data.forEach((instance, ik) => {
				if (instance.tasks.length > 0) {
					instance.tasks.forEach((task, tk) => {
						if (vm.initiated.indexOf(task.id) !== -1) {
							if (task.status === 'failed') {
								bootbox.alert("Instance " + instance.name + " - " + vm.tasks[task.action] + " " + task.status + "<br /><div class='col-md-12' style='overflow: scroll; height:200px;background-color: #000;'>" + task.message.toString().replace(/\n/g, "<br />") + "</div>");
								vm.initiated.splice(vm.initiated.indexOf(task.id), 1);
							}
						}
						if (['failed', 'done'].indexOf(task.status) === -1) {
							vm.poll_tasks.push(task.id);
							vm.$set(vm.instance_pagination.instances.data[ik], 'running_task', true);
						}
					})
				}
			});
			vm.polling = setInterval(() => {
				vm.update_tasks();
			}, 1000);
		},

		async update_tasks() {
			let vm = this, end = ['done', 'failed'];
			if (vm.poll_tasks.length >= 1) {
				let tasks = await vm.$axios.get('/admin/tasks', {params: {tasks: vm.poll_tasks.join(',')}}).catch((error) => {
				});
				tasks.data.forEach((task) => {
					vm.instance_pagination.instances.data.forEach((instance, ik) => {
						if (instance.id === task.instance_id) {
							vm.poll_tasks.forEach(async (task_id) => {
								if (task_id === task.id) {
									vm.instance_pagination.instances.data[ik].tasks.forEach((domtask, domid) => {
										if (domtask.id === task_id) {
											vm.$set(vm.instance_pagination.instances.data[ik].tasks, domid, task);
										}
									});
									if (end.indexOf(task.status) !== -1) {
										if (task.status === 'failed') {
											bootbox.alert("Instance " + instance.name + " - " + vm.tasks[task.action] + " " + task.status + "<br /><div class='col-md-12' style='overflow: scroll; height:200px;background-color: #000;'>" + task.message.toString().replace(/\n/g, "<br />") + "</div>");
										}
										setTimeout(async () => {
											let response = await vm.$axios.get('/admin/instances/' + task.instance_id);
											if (response) {
												vm.poll_tasks.splice(vm.poll_tasks.indexOf(task_id), 1);
												vm.$set(vm.instance_pagination.instances.data[ik], 'running_task', false);
												vm.$set(vm.instance_pagination.instances.data, ik, response.data);
											}
										}, 3000)
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
	},
	async asyncData({$axios, route}) {
		let hypervisor = [];
		let response = await $axios.get('/admin/instances', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : '',
				status: route.query.status,
				hypervisor_id: route.query.hypervisor_id
			}
		});

		if (route.query.hypervisor_id && route.query.hypervisor_id !== '') {
			let hypervisor_data = await $axios.get('/admin/hypervisors/' + route.query.hypervisor_id);
			if (hypervisor_data.data.id) {
				hypervisor.push({
					id: hypervisor_data.data.id,
					text: hypervisor_data.data.name + ' - ' + hypervisor_data.data.ip,
					selected: true
				});
			}
		}

		return {
			instance_pagination: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : '',
				instances: response.data,
			},
			filter: {
				status: route.query.status,
				hypervisor_id: route.query.hypervisor_id
			},
			hypervisor: hypervisor
		}

	},
	beforeMount() {
		this.do_polling();
	},
	mounted() {
		let vm = this;
		$('[name="status"]').select2({
			placeholder: "Filter Status",
			data: this.status,
			allowClear: true
		}).on('change', function () {
			vm.$set(vm.filter, "status", this.value);
		}).val(this.filter.status).trigger('change');

		$('[name="hypervisor_id"]').select2({
			placeholder: 'Filter Hypervisor',
			allowClear: true,
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/hypervisors',
				headers: {
					"Authorization": window.localStorage.getItem('auth._token.local'),
					"X-Requested-With": 'XMLHttpRequest',
					"Content-Type": "application/json",
				},
				dataType: 'json',
				delay: 250,
				data: function (params) {
					return {
						search: $.trim(params.term),
					}
				},
				processResults: function (data) {
					let hypervisors = [];
					data.data.forEach((hypervisor) => {
						hypervisors.push({id: hypervisor.id, text: hypervisor.name + ' - ' + hypervisor.ip});
					});
					return {
						results: hypervisors
					}
				},
				cache: true
			},
			data: this.hypervisor
		}).on('change', function () {
			vm.$set(vm.filter, "hypervisor_id", this.value);
		});
	},
	beforeDestroy() {
		clearInterval(this.polling);
		this.poll_tasks = [];
	}
}
</script>
<style>
.responsiveness {
	display: flex !important
}
</style>
