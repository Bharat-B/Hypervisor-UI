<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-random" aria-hidden="true"></i> Migrations</h2>
		<div class="col-md-12 email">
			<div class="box">
				<div class="row">
					<div class="col-lg-3">
						<label>Status</label>
						<select name="status" class="form-control" data-width="100%">
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
						<label>Source</label>
						<select name="source_hypervisor_id" class="form-control" data-width="100%">
							<option value=""></option>
						</select>
					</div>
					<div class="col-lg-3">
						<label>Destination</label>
						<select name="destination_hypervisor_id" class="form-control" data-width="100%">
							<option value=""></option>
						</select>
					</div>
				</div>
				<div class="table-responsive">
					<table class="table text-center">
						<thead>
						<tr>
							<th class="text-center">Select</th>
							<th class="text-center">Instance</th>
							<th class="text-center">Source</th>
							<th class="text-center">Destination</th>
							<th class="text-center">Status</th>
							<th class="text-center">Speed</th>
							<th class="text-center">Data</th>
							<th class="text-center">Progress</th>
							<th class="text-center">Duration</th>
							<th class="text-center">Created On</th>
							<th class="text-center">Log</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="migration in migration_pagination.migrations.data">
							<td>
								<label class="check">
									<input type="checkbox" v-model="migration.selected" @change.prevent="select_migration(migration)">
									<span class="checkmark"></span>
								</label>
							</td>
							<td>
								{{ migration.instance ? migration.instance.hostname : 'N/A' }}
								<nuxt-link tag="a" target="_blank"
										   :to="{name: 'admin-instance-id', params: {id: migration.instance_id}}"
										   v-if="migration.instance && migration.instance.deleted_at === null">
									<i class="fas fa-external-link-alt"></i>
								</nuxt-link>
							</td>
							<td>
								{{ migration.source ? migration.source.ip : 'N/A' }}
								<nuxt-link tag="a" target="_blank"
										   :to="{name: 'admin-hypervisor-id', params: {id: migration.source_hypervisor_id}}"
										   v-if="migration.source && migration.source.deleted_at === null">
									<i class="fas fa-external-link-alt"></i>
								</nuxt-link>
							</td>
							<td>
								{{ migration.destination ? migration.destination.ip : 'N/A' }}
								<nuxt-link tag="a" target="_blank"
										   :to="{name: 'admin-hypervisor-id', params: {id: migration.destination_hypervisor_id}}"
										   v-if="migration.destination && migration.destination.deleted_at === null">
									<i class="fas fa-external-link-alt"></i>
								</nuxt-link>
							</td>
							<td>
                                <span>
                                    <i class="fa fa-spin fa-spinner"
									   v-if="migration.status === 'pending' || migration.status === 'in_progress'"></i>
                                    <i class="fa fa-check" v-if="migration.status === 'completed'"></i>
                                    <i class="fa fa-times" v-if="migration.status === 'failed'"></i>
                                </span>
								{{ migration_status[migration.status] }}
							</td>
							<td>{{ migration.data.speed }}</td>
							<td>{{ migration.data.transfered }}</td>
							<td>{{ migration.progress }}</td>
							<td>{{ migration.duration }}</td>
							<td>{{ migration.created_at }}</td>
							<td><textarea class="form-control" rows="3" cols="30">{{ migration.message }}</textarea></td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="">
					<div class="pull-left">
						<div class="col-lg-3" v-if="selected_migrations.length > 0">
							<button class="btn btn-default" :disabled="processing" @click.prevent="delete_migrations">
								<i class="fa fa-spin fa-spinner" v-if="processing"></i>
								<i class="fa fa-trash" v-else></i>
								Delete
							</button>
						</div>
					</div>
					<div class="ipages">
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
									aria-haspopup="true" aria-expanded="false"> {{ migration_pagination.per_page }} entries
							</button>
							<ul class="dropdown-menu">
								<li :class="{active: migration_pagination.per_page === 20}"><a href="#"
																						  @click.prevent="$set($data.migration_pagination,'per_page',20)">20
									entries</a></li>
								<li :class="{active: migration_pagination.per_page === 50}"><a href="#"
																						  @click.prevent="$set($data.migration_pagination,'per_page',50)">50
									entries</a></li>
								<li :class="{active: migration_pagination.per_page === 100}"><a href="#"
																						   @click.prevent="$set($data.migration_pagination,'per_page',100)">100
									entries</a></li>
							</ul>
						</div>
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
									aria-haspopup="true" aria-expanded="false"> Page
								{{ migration_pagination.migrations.current_page }}
								<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
							</button>
							<ul class="dropdown-menu">
								<li v-for="i in $pageRange(migration_pagination.migrations.last_page)">
									<a href="#" @click.prevent="$set($data.migration_pagination,'page',i)">
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
		title: 'Instance Migrations'
	},
	watch: {
		'filter': {
			handler: function (filter) {
				this.search();
			},
			deep: true
		},
		'migration_pagination.page': function () {
			this.search();
		},
		'migration_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			processing: false,
			migration_pagination: {
				page: 1,
				per_page: 20,
				migrations: {
					data: [],
					total: 0
				},
				search: ""
			},
			migration_status: {
				pending: "Waiting",
				started: "Running",
				failed: "Failed",
				completed: "Finished"
			},
			polling: null,
			poll_migrations: [],
			filter: {
				status: '',
				instance_id: '',
				source_hypervisor_id: '',
				destination_hypervisor_id: ''
			},
			selected_migrations: [],
			status: [
				{id: 'pending', text: "Waiting"},
				{id: 'in_progress', text: "Running"},
				{id: 'completed', text: "Finished"},
				{id: 'failed', text: "Failed"}
			]
		}
	},
	methods: {
		async search() {
			clearInterval(this.polling);
			this.$router.push({
				name: this.$route.name, query: {
					page: this.migration_pagination.page,
					per_page: this.migration_pagination.per_page,
					...this.filter
				}
			})
		},
		do_polling() {
			let vm = this;
			clearInterval(vm.polling);
			vm.migration_pagination.migrations.data.forEach((migration, k) => {
				if (['completed', 'failed'].indexOf(migration.status) === -1) {
					vm.poll_migrations[k] = migration.id;
				}
			});
			vm.polling = setInterval(() => {
				vm.update_migrations();
			}, 5000);
		},
		async update_migrations() {
			let vm = this, end = ['done', 'failed'];
			if (vm.poll_migrations.length >= 1) {
				let response = await vm.$axios.get('admin/migrations', {
					params: {
						migrations: vm.poll_migrations.join(',')
					}
				});
				response.data.forEach((migration) => {
					vm.poll_migrations.forEach((migrationid, tk) => {
						if (migrationid === migration.id) {
							vm.$set(vm.migration_pagination.migrations.data, tk, migration);
							if (end.indexOf(migration.status) !== -1) {
								vm.poll_migrations.splice(tk, 1);
							}
						}
					});
				});
			}
			if (vm.poll_migrations.length <= 0) {
				clearInterval(vm.polling);
			}
		},
		select_migration(migration) {
			if (migration.selected) {
				if (this.selected_migrations.indexOf(migration.id) === -1) {
					this.selected_migrations.push(migration.id);
				}
			} else {
				if (this.selected_migrations.indexOf(migration.id) !== -1) {
					this.selected_migrations.splice(this.selected_migrations.indexOf(migration.id), 1);
				}
			}
		},
		async get_migrations() {
			clearInterval(this.polling);
			let response = await this.$axios.get('/admin/migrations', {
				params: {
					page: this.$route.query.page ? this.$route.query.page : 1,
					per_page: this.$route.query.per_page ? this.$route.query.per_page : 20,
					status: this.$route.query.status,
					instance_id: this.$route.query.instance_id,
					source_hypervisor_id: this.$route.query.source_hypervisor_id,
					destination_hypervisor_id: this.$route.query.destination_hypervisor_id

				}
			});
			this.$set(this, 'migration_pagination', {
				page: this.$route.query.page ? this.$route.query.page : 1,
				per_page: this.$route.query.per_page ? this.$route.query.per_page : 20,
				migrations: response.data
			});
			this.$set(this, 'filter', {
				status: this.$route.query.status,
				instance_id: this.$route.query.instance_id,
				source_hypervisor_id: this.$route.query.source_hypervisor_id,
				destination_hypervisor_id: this.$route.query.destination_hypervisor_id
			});
			this.do_polling();
		},
		delete_migrations() {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Delete the selected migration(s)?",
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
						vm.$axios.post('/admin/migrations/delete', {migrations: vm.selected_migrations}).then((response) => {
							vm.get_migrations();
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
		let response = await $axios.get('/admin/migrations', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				status: route.query.status,
				instance_id: route.query.instance_id,
				source_hypervisor_id: route.query.source_hypervisor_id,
				destination_hypervisor_id: route.query.destination_hypervisor_id
			}
		});
		return {
			migration_pagination: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				migrations: response.data
			},
			filter: {
				status: route.query.status,
				instance_id: route.query.instance_id,
				source_hypervisor_id: route.query.source_hypervisor_id,
				destination_hypervisor_id: route.query.destination_hypervisor_id
			},
			hypervisor: hypervisor,
			instance: instance
		}
	},

	created() {
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
		}).val(this.filter.instance_id).trigger('change');

		$('[name="source_hypervisor_id"]').select2({
			placeholder: 'Source Hypervisor',
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
						hypervisors.push({id: hypervisor.id, text: hypervisor.ip});
					});
					return {
						results: hypervisors
					}
				},
				cache: true
			},
			data: this.hypervisor
		}).on('change', function () {
			vm.$set(vm.filter, "source_hypervisor_id", this.value);
		});

		$('[name="destination_hypervisor_id"]').select2({
			placeholder: 'Source Hypervisor',
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
						hypervisors.push({id: hypervisor.id, text: hypervisor.ip});
					});
					return {
						results: hypervisors
					}
				},
				cache: true
			},
			data: this.hypervisor
		}).on('change', function () {
			vm.$set(vm.filter, "source_hypervisor_id", this.value);
		});
	},

	beforeDestroy() {
		clearInterval(this.polling);
	}
}
</script>
