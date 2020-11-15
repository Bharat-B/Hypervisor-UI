<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-home"></i> Admin Dashboard</h2>
		<div class="row dashboard">
			<div class="col-md-3">
				<div class="box">
					<i class="fa fa-server" aria-hidden="true"></i>
					<h4>
						<nuxt-link :to="{name: 'admin-hypervisors'}" tag="a">Hypervisors</nuxt-link>
					</h4>
					<hr>
					<p>
						<a href="#"><b>{{ dashboard.hypervisors.total }}</b> Total</a>
						<a href="#"><b>{{ dashboard.hypervisors.active }}</b> Active</a>
					</p>
				</div>
			</div>
			<div class="col-md-3">
				<div class="box">
					<i class="fa fa-users" aria-hidden="true"></i>
					<h4>
						<nuxt-link :to="{name: 'admin-users'}" tag="a">Users</nuxt-link>
					</h4>
					<hr>
					<p><b>{{ dashboard.users.active }}</b> Active <a href="#"><b>{{ dashboard.users.inactive }}</b>
						Suspended</a></p>
				</div>
			</div>

			<div class="col-md-3">
				<div class="box">
					<i class="fa fa-map-marker" aria-hidden="true"></i>
					<h4>
						<nuxt-link :to="{name: 'admin-regions'}" tag="a">Regions</nuxt-link>
					</h4>
					<hr>
					<p>
						<b>{{ dashboard.regions.total }}</b> Total
						<b>{{ dashboard.regions.active }}</b> Active
					</p>
				</div>
			</div>
			<div class="col-md-3">
				<div class="box">
					<i class="fa fa-th-large" aria-hidden="true"></i>
					<h4>
						<nuxt-link :to="{name: 'admin-instances'}" tag="a">Instances</nuxt-link>
					</h4>
					<hr>
					<p>
						<b>{{ dashboard.instances.total }}</b> Total
						<b>{{ dashboard.instances.active }}</b> Active
					</p>
				</div>
			</div>
		</div>
		<br/>
		<div class="row dashboard">
			<div class="col-md-4">
				<div class="box" v-show="enabledBilling">
					<h4><i class="fas fa-file-invoice-dollar"></i> Income Statistics</h4>
					<br/>
					<div class="table-wrap table-responsive">
						<table class="table table-striped">
							<thead>
							<tr>
								<th>Period</th>
								<th>Income</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td> Today</td>
								<td><b>{{ $currencyFormat(income.today) }}</b></td>
							</tr>
							<tr>
								<td> This Month</td>
								<td><b>{{ $currencyFormat(income.month) }}</b></td>
							</tr>
							<tr>
								<td> This Year</td>
								<td><b>{{ $currencyFormat(income.year) }}</b></td>
							</tr>
							<tr>
								<td> All Time</td>
								<td><b>{{ $currencyFormat(income.all_time) }}</b></td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
				<br>
				<div class="box">
					<h4><i class="fas fa-chart-area"></i> Cluster Statistics</h4>
					<br/>
					<div class="table-wrap table-responsive">
						<table class="table table-striped">
							<thead>
							<tr>
								<th>Resource</th>
								<th>Availability</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td><i class="fab fa-connectdevelop" aria-hidden="true"></i> IPv4</td>
								<td><b>{{ dashboard.ipv4.used }}</b> / <b>{{ dashboard.ipv4.total }}</b></td>
							</tr>
							<tr>
								<td><i class="fab fa-connectdevelop" aria-hidden="true"></i> IPv6</td>
								<td><b>{{ dashboard.ipv6.used }}</b> / <b>{{ dashboard.ipv6.total }}</b></td>
							</tr>
							<tr>
								<td><i class="fab fa-connectdevelop" aria-hidden="true"></i> IPv6 Subnets</td>
								<td><b>{{ dashboard.ipv6_subnet.used }}</b> / <b>{{ dashboard.ipv6_subnet.total }}</b>
								</td>
							</tr>
							<tr>
								<td><i class="fas fa-memory" aria-hidden="true"></i> RAM</td>
								<td><b>{{ used_ram }}</b> / <b>{{ total_ram }}</b></td>
							</tr>
							<tr>
								<td><i class="far fa-hdd" aria-hidden="true"></i> Storage</td>
								<td><b>{{ used_storage }}</b> / <b>{{ total_storage }}</b></td>
							</tr>
							<tr>
								<td><i class="fas fa-tachometer-alt" aria-hidden="true"></i> Bandwidth</td>
								<td><b>{{ used_bandwidth }}</b> / <b>{{ total_bandwidth }}</b></td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="col-md-8">
				<div class="box hypervisor" v-show="hypervisor.hasOwnProperty('id')">
					<div class="row">
						<div class="col-lg-4">
							<select2 class="hpanel" v-bind:name="'hypervisor_id'" v-bind:allowclear="'true'" v-once></select2>
						</div>
						<div class="col-md-4">
							<nuxt-link :to="{name: 'admin-hypervisor-id', params: {id: hypervisor.id }}" class="btn btn-default">
								<i class="fa fa-list" aria-hidden="true"></i> Edit
							</nuxt-link>
							<button class="btn btn-default" @click.prevent="refresh_hypervisor">
								<i class="fa fa-sync" aria-hidden="true"></i> Refresh Data
							</button>
						</div>
					</div>
					<br>
					<div class="jumbotron hdetails" v-if="hypervisor.id">
						<div class="row">
							<div class="col-md-6">
								<li><b>Server Status</b>: {{ status[hypervisor.status] }}</li>
								<li><b>Bridge Status</b>: {{ status[hypervisor.hypervisor_vbridge] }}</li>
								<li><b>API Status</b>: {{ status[hypervisor.hypervisor_service] }}</li>
								<li><b>Hostname</b>: {{ hypervisor.hostname }}</li>
								<li><b>Uptime</b>: {{ hypervisor.uptime }}</li>
								<li><b>Load Avg</b>: {{ hypervisor.load_avg }}</li>
								<li><b>CPU Model</b>: {{ hypervisor.cpu_model }}</li>
								<li><b>OS</b>: <img :src="'/assets/'+hypervisor.os+'.png'"/>
									{{ $ucfirst(hypervisor.os) }} - {{ hypervisor.arch }}
								</li>
								<li><b>Kernel</b>: {{ hypervisor.uname }}</li>
								<span v-if="hypervisor.license">
                                    <li><b>License</b>: {{ hypervisor.license.key }}</li>
                                    <li><b>Status</b>: {{ hypervisor.license.status }}</li>
                                    <li><b>Type</b>: {{ hypervisor.license.type }}</li>
                                    <li><b>Instance Count:</b> {{ hypervisor.license.licnumvs === -1 ? 'Unlimited' : hypervisor.license.licnumvs }}</li>
                                    <li><b>License Expiry</b>: {{ hypervisor.license.expires_on }}</li>
                                </span>
							</div>
							<div class="col-md-6">
								<h3 class="text-center">Bandwidth Usage</h3>
								<area-chart :min="0" :legend="true" suffix="GB" :data="bandwidthChart.series"></area-chart>
								<hr>
								<h3 class="text-center">Network Speed</h3>
								<br>
								<div class="row">
									<div class="downloads pull-left" style="font-weight: bold; font-size: 20px">Download: {{ hypervisor.current_stats.network_speed.download_speed }} Kb/s</div>
									<div class="uploads pull-right" style="font-weight: bold; font-size: 20px">Upload: {{ hypervisor.current_stats.network_speed.upload_speed }} Kb/s</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<br>
				<div class="box">
					<h4><i class="fa fa-list-ol" aria-hidden="true"></i>Recent Tasks</h4>
					<br/>
					<div class="table-wrap table-responsive">
						<table class="table table-striped">
							<thead>
							<tr>
								<th class="text-center">Action</th>
								<th class="text-center">Instance</th>
								<th class="text-center">Hypervisor</th>
								<th class="text-center">User</th>
								<th class="text-center">Status</th>
								<th class="text-center">Progress</th>
								<th class="text-center">Duration</th>
								<th class="text-center">Created On</th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="task in tasks.data">
								<td>{{ task.action }}</td>
								<td>{{ task.instance ? "( " + task.instance.name + " ) - " + task.instance.hostname : 'N/A' }}</td>
								<td>{{ task.hypervisor ? "( " + task.hypervisor.name + " ) - " + task.hypervisor.ip : 'N/A' }}</td>
								<td>{{ task.user ? task.user.email : task.admin ? task.admin.email : 'N/A' }}</td>
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
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<!-- End of Content -->
	</div>
</template>
<script>
import Select2 from "~/components/bootstrap/select2.vue";

export default {
	layout: 'admin',
	head: {
		title: 'Admin Dashboard'
	},
	components: {
		'select2': Select2
	},
	data() {
		return {
			dashboard: {},
			tasks: {},
			task_status: {
				pending: "Waiting",
				started: "Running",
				failed: "Failed",
				done: "Finished"
			},
			poll_tasks: [],
			polling: null,
			hypervisor: {},
			status: {
				0: "Stopped",
				1: "Running"
			},
			bandwidthChart: {
				series: [{
					name: 'Uploads',
					data: {},
				},{
					name: 'Downloads',
					data: {}
				}]
			},
			networkChart: {
				series: [{
					name: 'Upload Speed',
					data: {},
				},{
					name: 'Download Speed',
					data: {}
				}]
			},
			hypervisor_polling: false
		}
	},
	methods: {
		refresh_hypervisor() {
			let vm = this;
			vm.$axios.get('/admin/hypervisors/' + vm.hypervisor.id).then((response) => {
				vm.hypervisor = response.data;
			}).catch(() => {

			});
		},
		get_tasks(page = 1) {
			clearInterval(this.polling);
			this.$axios.get('/admin/tasks', {params: {per_page: 5, page: page}}).then((response) => {
				this.$set(this, 'tasks', response.data);
				this.do_polling();
			}).catch((error) => {

			});
		},
		do_polling() {
			let vm = this;
			vm.tasks.data.forEach((task, k) => {
				if (['done', 'failed'].indexOf(task.status) === -1) {
					vm.poll_tasks[k] = task.id;
				}
			});
			clearInterval(vm.polling);
			vm.polling = setInterval(() => {
				vm.update_tasks();
			}, 5000);
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
					vm.poll_tasks.forEach(async (taskid, tk) => {
						if (taskid === task.id) {
							vm.$set(vm.tasks.data, tk, task);
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
		update_chart(){
			let vm = this;
			let bandwidth_series = {
				uploads: {},
				downloads: {}
			}

			for (let i = 0; i < vm.hypervisor.bw.length; i++) {
				if(i === 0){
					bandwidth_series.uploads[vm.hypervisor.bw[i].for_date] = Math.round((vm.hypervisor.bw[i].bytes_out)/1024/1024/1024);
					bandwidth_series.downloads[vm.hypervisor.bw[i].for_date] = Math.round((vm.hypervisor.bw[i].bytes_in)/1024/1024/1024);
				} else {

					let now_in = Math.round( ( vm.hypervisor.bw[i].bytes_in )/1024/1024/1024)
					let prev_in = Math.round( ( vm.hypervisor.bw[i-1].bytes_in )/1024/1024/1024)
					let now_out = Math.round( ( vm.hypervisor.bw[i].bytes_out )/1024/1024/1024)
					let prev_out = Math.round( ( vm.hypervisor.bw[i-1].bytes_out )/1024/1024/1024)

					if(now_in > prev_in){
						bandwidth_series.downloads[vm.hypervisor.bw[i].for_date] = now_in - prev_in;
					} else if(prev_in > now_in){
						bandwidth_series.downloads[vm.hypervisor.bw[i].for_date] = now_in;
					} else {
						bandwidth_series.downloads[vm.hypervisor.bw[i].for_date] = 0;
					}
					if(now_out > prev_out){
						bandwidth_series.uploads[vm.hypervisor.bw[i].for_date] = now_out - prev_out;
					} else if(prev_out > now_out){
						bandwidth_series.uploads[vm.hypervisor.bw[i].for_date] = now_out;
					} else {
						bandwidth_series.uploads[vm.hypervisor.bw[i].for_date] = 0;
					}
				}
			}

			console.log(JSON.stringify(bandwidth_series));

			vm.$set(vm.bandwidthChart,"series",[
				{
					name: 'Uploads',
					data: bandwidth_series.uploads,
				},{
					name: 'Downloads',
					data: bandwidth_series.downloads
				}
			]);
			vm.networkChart.series[0].data[vm.hypervisor.updated_at] = vm.hypervisor.current_stats.network_speed.upload_speed;
			vm.networkChart.series[1].data[vm.hypervisor.updated_at] = vm.hypervisor.current_stats.network_speed.download_speed;
		}
	},
	async asyncData({$axios, route}) {
		let dashboard_response = await $axios.get('/admin/json/dashboard');
		let income_response = await $axios.get('/admin/json/income');
		let tasks = await $axios.get('/admin/tasks', {params: {per_page: 5}});
		let hypervisors = await $axios.get('/admin/hypervisors');
		let thypervisor = false;
		if (hypervisors.data.data.length > 0) {
			let response = await $axios.get('/admin/hypervisors/' + hypervisors.data.data[0].id);
			thypervisor = response.data;
		}

		return {
			dashboard: dashboard_response.data,
			income: income_response.data,
			tasks: tasks.data,
			hypervisor: thypervisor ? thypervisor : {license: {}},
			bandwidthChart: {
				options: {},
				series: [{name: '', data: []}]
			}
		}
	},
	mounted() {
		let vm = this;
		vm.do_polling();
		setTimeout(() => {
			$('[name="hypervisor_id"]').select2({
				placeholder: 'Select Hypervisor',
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
							hypervisors.push({id: hypervisor.id, text: [hypervisor.name, hypervisor.ip].join(' - ')});
						});
						return {
							results: hypervisors
						}
					},
					cache: true
				},
				data: [{id: vm.hypervisor.id, text: [vm.hypervisor.name, vm.hypervisor.ip].join(' - '), selected: true}]
			}).on('change', function () {
				clearInterval(vm.hypervisor_polling)
				if (this.value !== '') {
					vm.$axios.get('/admin/hypervisors/' + this.value).then((response) => {
						vm.hypervisor = response.data;
						vm.update_chart();
					}).catch(() => {

					});
					vm.hypervisor_polling = setInterval(() => {
						vm.$axios.get('/admin/hypervisors/' + this.value).then((response) => {
							vm.hypervisor = response.data;
							vm.update_chart();
						});
					}, 60000)
				}
			});
		}, 1000);
		this.update_chart();
	},
	beforeDestroy() {
		clearInterval(this.polling);
		clearInterval(this.hypervisor_polling);
	},
	computed: {
		total_ram() {
			if (this.dashboard.ram.total < 1024) {
				return this.dashboard.ram.total + ' MB'
			}
			if (this.dashboard.ram.total > 1024) {
				return Math.round(this.dashboard.ram.total / 1024) + ' GB'
			}
			if (Math.round(this.dashboard.ram.total / 1024) > 1024) {
				return Math.round(this.dashboard.ram.total / 1024 * 1024) + ' TB'
			}
		},
		used_ram() {
			if (this.dashboard.ram.used < 1024) {
				return this.dashboard.ram.used + ' MB'
			}
			if (this.dashboard.ram.used > 1024) {
				return Math.round(this.dashboard.ram.used / 1024, 2) + ' GB'
			}
			if (Math.round(this.dashboard.ram.used / 1024) > 1024) {
				return Math.round(this.dashboard.ram.used / 1024 * 1024) + ' TB'
			}
		},
		total_storage() {
			if (this.dashboard.storage.total < 1024) {
				return this.dashboard.storage.total + ' GB';
			}
			if (this.dashboard.storage.total > 1024) {
				return Math.round(this.dashboard.storage.total / 1024) + ' TB'
			}
			if (Math.round(this.dashboard.storage.total / 1024) > 1024) {
				return Math.round(this.dashboard.storage.total / 1024 * 1024) + ' PB'
			}
		},
		used_storage() {
			if (this.dashboard.storage.used < 1024) {
				return this.dashboard.storage.used + ' GB';
			}
			if (this.dashboard.storage.used > 1024) {
				return Math.round(this.dashboard.storage.used / 1024) + ' TB'
			}
			if (Math.round(this.dashboard.storage.used / 1024) > 1024) {
				return Math.round(this.dashboard.storage.used / 1024 * 1024) + ' PB'
			}
		},
		total_bandwidth() {
			if (this.dashboard.bandwidth.total < 1024) {
				return this.dashboard.bandwidth.total + ' GB';
			}
			if (this.dashboard.bandwidth.total > 1024) {
				return Math.round(this.dashboard.bandwidth.total / 1024) + ' TB'
			}
			if (Math.round(this.dashboard.bandwidth.total / 1024) > 1024) {
				return Math.round(this.dashboard.bandwidth.total / 1024 * 1024) + ' PB'
			}
		},
		used_bandwidth() {
			if (this.dashboard.bandwidth.used < 1024) {
				return this.dashboard.bandwidth.used + ' GB';
			}
			if (this.dashboard.bandwidth.used > 1024) {
				return Math.round(this.dashboard.bandwidth.used / 1024) + ' TB'
			}
			if (Math.round(this.dashboard.bandwidth.used / 1024) > 1024) {
				return Math.round(this.dashboard.bandwidth.used / 1024 * 1024) + ' PB'
			}
		}
	}
}
</script>
<style>
.hservices .col-lg-12, .hservices .col-lg-6 {
	background-color: #3D3487;
	color: #fff;
	padding: 16px 25px 16px 25px;
	border-right: 1px solid rgba(0, 0, 0, 0.1);
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.hservices .col-lg-12 p {
	float: left;
}
</style>
