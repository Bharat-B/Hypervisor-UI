<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-tasks" aria-hidden="true"></i> Tasks</h2>
		<div class="col-md-12 email">
			<div class="box">
				<div class="row">
					<div class="col-lg-3">
						<label>Action</label>
						<select name="action" class="form-control" data-width="100%">
							<option value=""></option>
						</select>
					</div>
					<div class="col-lg-3">
						<label>Instance</label>
						<select name="instance_id" class="form-control" data-width="100%">
							<option value=""></option>
						</select>
					</div>
					<div class="col-lg-3">
						<label>Hypervisor</label>
						<select name="hypervisor_id" class="form-control" data-width="100%">
							<option value=""></option>
						</select>
					</div>
					<div class="col-lg-3">
						<label>Status</label>
						<select name="status" class="form-control" data-width="100%">
							<option value=""></option>
						</select>
					</div>
				</div>
				<div class="table-responsive">
					<table class="table text-center">
						<thead>
						<tr>
							<th class="text-center">Select</th>
							<th class="text-center">Action</th>
							<th class="text-center">Instance</th>
							<th class="text-center">Hypervisor</th>
							<th class="text-center">User</th>
							<th class="text-center">Status</th>
							<th class="text-center">Progress</th>
							<th class="text-center">Duration</th>
							<th class="text-center">Created On</th>
							<th class="text-center">Log</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="task in task_pagination.tasks.data">
							<td>
								<label class="check">
									<input type="checkbox" v-model="task.selected" @change.prevent="select_task(task)">
									<span class="checkmark"></span>
								</label>
							</td>
							<td>{{ task.action }}</td>
							<td>
								{{ task.instance ? task.instance.hostname : 'N/A' }}
								<nuxt-link tag="a" target="_blank"
										   :to="{name: 'admin-instance-id', params: {id: task.instance_id}}"
										   v-if="task.instance && task.instance.deleted_at === null">
									<i class="fas fa-external-link-alt"></i>
								</nuxt-link>
							</td>
							<td>
								{{ task.hypervisor ? task.hypervisor.ip : 'N/A' }}
								<nuxt-link tag="a" target="_blank"
										   :to="{name: 'admin-hypervisor-id', params: {id: task.hypervisor_id}}"
										   v-if="task.hypervisor && task.hypervisor.deleted_at === null">
									<i class="fas fa-external-link-alt"></i>
								</nuxt-link>
							</td>
							<td>
								{{ task.user ? task.user.email : task.admin ? task.admin.email : 'N/A' }}
								<nuxt-link tag="a" target="_blank"
										   :to="{name: 'admin-user-id', params: {id: task.user ? task.user_id : task.admin ? task.admin_id : 0 }}"
										   v-if="( task.user && task.user.deleted_at === null ) || ( task.admin && task.admin.deleted_at === null )">
									<i class="fas fa-external-link-alt"></i>
								</nuxt-link>
							</td>
							<td>
                                <span>
                                    <i class="fa fa-spin fa-spinner"
									   v-if="task.status === 'started' || task.status === 'in_progress'"></i>
                                    <i class="fa fa-check" v-if="task.status === 'done'"></i>
                                    <i class="fa fa-times" v-if="task.status === 'failed'"></i>
                                </span>
								{{ task_status[task.status] }}
							</td>
							<td>{{ task.progress }}</td>
							<td>{{ task.duration }}</td>
							<td>{{ task.created_at }}</td>
							<td><textarea class="form-control" rows="3" cols="30">{{ task.message }}</textarea></td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="">
					<div class="pull-left">
						<div class="col-lg-3" v-if="selected_tasks.length > 0">
							<button class="btn btn-default" :disabled="processing" @click.prevent="delete_tasks">
								<i class="fa fa-spin fa-spinner" v-if="processing"></i>
								<i class="fa fa-trash" v-else></i>
								Delete
							</button>
						</div>
					</div>
					<div class="ipages">
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
									aria-haspopup="true" aria-expanded="false"> {{ task_pagination.per_page }} entries
							</button>
							<ul class="dropdown-menu">
								<li :class="{active: task_pagination.per_page === 20}"><a href="#"
																						  @click.prevent="$set($data.task_pagination,'per_page',20)">20
									entries</a></li>
								<li :class="{active: task_pagination.per_page === 50}"><a href="#"
																						  @click.prevent="$set($data.task_pagination,'per_page',50)">50
									entries</a></li>
								<li :class="{active: task_pagination.per_page === 100}"><a href="#"
																						   @click.prevent="$set($data.task_pagination,'per_page',100)">100
									entries</a></li>
							</ul>
						</div>
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
									aria-haspopup="true" aria-expanded="false"> Page
								{{ task_pagination.tasks.current_page }}
								<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
							</button>
							<ul class="dropdown-menu">
								<li v-for="i in $pageRange(task_pagination.tasks.last_page)">
									<a href="#" @click.prevent="$set($data.task_pagination,'page',i)">
										{{ i }}
									</a>
								</li>
							</ul>
						</div>
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
		title: 'Tasks'
	},
	watch: {
		'filter': {
			handler: function (filter) {
				this.search();
			},
			deep: true
		},
		'task_pagination.page': function () {
			this.search();
		},
		'task_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			processing: false,
			task_pagination: {
				page: 1,
				per_page: 20,
				tasks: {
					data: [],
					total: 0
				},
				search: ""
			},
			actions: [
				{id: 'download_image', text: 'Download Image'},
				{id: 'download_iso', text: 'Download ISO'},
				{id: 'create_instance', text: 'Create Instance'},
				{id: 'panel_import', text: 'Import Panel'},
				{id: 'create_image', text: 'Create Image'},
				{id: 'rebuild_instance', text: 'Rebuild Instance'},
				{id: 'start_instance', text: 'Start Instance'},
				{id: 'stop_instance', text: 'Stop Instance'},
				{id: 'restart_instance', text: 'Restart Instance'},
				{id: 'shutdown_instance', text: 'Shutdown Instance'},
				{id: 'instance_enable_rescue', text: 'Enable Rescue'},
				{id: 'instance_disable_rescue', text: 'Disable Rescue'},
				{id: 'destroy_instance', text: 'Destroy Instance'},
				{id: 'suspend_instance', text: 'Suspend Instance'},
				{id: 'resume_instance', text: 'Resume Instance'},
				{id: 'suspend_instance_network', text: 'Suspend Instance Network'},
				{id: 'resume_instance_network', text: 'Resume Instance Network'}
			],
			status: [
				{id: 'pending', text: 'Waiting'},
				{id: 'started', text: 'Started'},
				{id: 'failed', text: 'Failed'},
				{id: 'done', text: 'Finished'}
			],
			task_status: {
				pending: "Waiting",
				started: "Running",
				failed: "Failed",
				done: "Finished"
			},
			polling: null,
			poll_tasks: [],
			filter: {
				action: '',
				status: '',
				instance_id: '',
				hypervisor_id: ''
			},
			instance: [],
			hypervisor: [],
			selected_tasks: []
		}
	},
	methods: {
		async search() {
			this.$router.push({
				name: this.$route.name, query: {
					page: this.task_pagination.page,
					per_page: this.task_pagination.per_page,
					...this.filter
				}
			})
			this.do_polling();
		},
		do_polling() {
			let vm = this;
			clearInterval(vm.polling);
			vm.task_pagination.tasks.data.forEach((task, k) => {
				if (['done', 'failed'].indexOf(task.status) === -1) {
					vm.poll_tasks[k] = task.id;
				}
			});
			vm.polling = setInterval(() => {
				vm.update_tasks();
			}, 20000);
		},
		async update_tasks() {
			let vm = this, end = ['done', 'failed'];
			if (vm.poll_tasks.length >= 1) {
				let response = await vm.$axios.get('admin/tasks', {
					params: {
						tasks: vm.poll_tasks.join(',')
					}
				});
				response.data.forEach((task) => {
					vm.poll_tasks.forEach((taskid, tk) => {
						if (taskid === task.id) {
							vm.$set(vm.task_pagination.tasks.data, tk, task);
							if (end.indexOf(task.status) !== -1) {
								vm.poll_tasks.splice(tk, 1);
							}
						}
					});
				});
			}
			if (vm.poll_tasks.length <= 0) {
				clearInterval(vm.polling);
			}
		},
		select_task(task) {
			if (task.selected) {
				if (this.selected_tasks.indexOf(task.id) === -1) {
					this.selected_tasks.push(task.id);
				}
			} else {
				if (this.selected_tasks.indexOf(task.id) !== -1) {
					this.selected_tasks.splice(this.selected_tasks.indexOf(task.id), 1);
				}
			}
		},
		async get_tasks() {
			let vm = this;
			clearInterval(this.polling);
			let response = await vm.$axios.get('/admin/tasks', {
				params: {
					page: vm.$route.query.page ? vm.$route.query.page : 1,
					per_page: vm.$route.query.per_page ? vm.$route.query.per_page : 20,
					action: vm.$route.query.action,
					status: vm.$route.query.status,
					instance_id: vm.$route.query.instance_id,
					hypervisor_id: vm.$route.query.hypervisor_id
				}
			});
			response.data.forEach((task,k)=>{
				if( vm.selected_tasks.indexOf(task.id) !== -1 ){
					response.data[k].selected = true;
				}
			});
			vm.$set(vm, 'task_pagination', {
				page: vm.$route.query.page ? vm.$route.query.page : 1,
				per_page: vm.$route.query.per_page ? vm.$route.query.per_page : 20,
				tasks: response.data
			});
			vm.$set(vm, 'filter', {
				action: vm.$route.query.action,
				status: vm.$route.query.status,
				instance_id: vm.$route.query.instance_id,
				hypervisor_id: vm.$route.query.hypervisor_id
			});
			this.do_polling();
		},
		delete_tasks() {
			let vm = this;
			vm.processing = true;
			bootbox.confirm({
				title: "Delete the selected task(s)?",
				message: "Please note that no further confirmations will appear.",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i> Delete',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.post('/admin/tasks/delete', {tasks: vm.selected_tasks}).then((response) => {
							vm.get_tasks();
						}).catch((error) => {
							vm.processing = false;
						});
					}
					vm.processing = false;
				}
			});
		}
	},

	async asyncData({$axios, route}) {
		let hypervisor = [], instance = [];
		let response = await $axios.get('/admin/tasks', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				action: route.query.action,
				status: route.query.status,
				instance_id: route.query.instance_id,
				hypervisor_id: route.query.hypervisor_id
			}
		});
		if (route.query.hypervisor_id && route.query.hypervisor_id !== '') {
			let hypervisor_data = await $axios.get('/admin/hypervisors/' + route.query.hypervisor_id);
			if (hypervisor_data.data.id) {
				hypervisor.push({id: hypervisor_data.data.id, text: hypervisor_data.data.name+' - '+hypervisor_data.data.ip, selected: true});
			}
		}
		if (route.query.instance_id && route.query.instance_id !== '') {
			let instance_data = await $axios.get('/admin/instances/' + route.query.instance_id);
			if (instance_data.data.id) {
				instance.push({
					id: instance_data.id,
					text: instance_data.name + '-' + instance_data.hostname,
					selected: true
				});
			}
		}

		return {
			task_pagination: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				tasks: response.data
			},
			filter: {
				action: route.query.action,
				status: route.query.status,
				instance_id: route.query.instance_id,
				hypervisor_id: route.query.hypervisor_id
			},
			hypervisor: hypervisor,
			instance: instance
		}
	},

	beforeMount() {
		this.do_polling();
	},
	mounted() {
		let vm = this;

		$('[name="action"]').select2({
			placeholder: "Filter Action",
			data: this.actions,
			allowClear: true
		}).on('change', function () {
			vm.$set(vm.filter, "action", this.value);
		}).val(this.filter.action).trigger('change');

		$('[name="status"]').select2({
			placeholder: "Filter Status",
			data: this.status,
			allowClear: true
		}).on('change', function () {
			vm.$set(vm.filter, "status", this.value);
		}).val(this.filter.status).trigger('change');

		$('[name="instance_id"]').select2({
			placeholder: 'Filter Instance',
			allowClear: true,
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/instances',
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
					let instances = [];
					data.data.forEach((instance) => {
						instances.push({id: instance.id, text: instance.name + '-' + instance.hostname});
					});
					return {
						results: instances
					}
				},
				cache: true
			},
			data: this.instance
		}).on('change', function () {
			vm.$set(vm.filter, "instance_id", this.value);
		});

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
						hypervisors.push({id: hypervisor.id, text: hypervisor.name+' - '+hypervisor.ip});
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
	}
}
</script>
