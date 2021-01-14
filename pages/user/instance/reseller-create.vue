<template>
	<div class="dashcontent">
		<h1 style="font-size: 14pt;"><i class="fas fa-server" aria-hidden="true"></i> Create Instance</h1>
		<div class="dashstuff">
			<div class="tab-content">
				<div role="tabpanel" class="wow fadeIn reseller tab-pane active">
					<form @submit.prevent="create">
						<h4>Region / User</h4>
						<hr>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.user_id}">
									<label> Select Region</label>
									<select name="region_id" class="form-control input-lg" data-width="100%">
										<option value=""></option>
									</select>
									<span class="help-block" v-if="errors.user_id">{{ errors.user_id[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.user_id}">
									<label> Select User</label>
									<select name="user_id" class="form-control input-lg" data-width="100%">
										<option value=""></option>
									</select>
									<span class="help-block" v-if="errors.user_id">{{ errors.user_id[0] }}</span>
								</div>
							</div>
						</div>
						<div v-if="user_id === ''">
							<h4>New User Details - ( {{ user_limit }} )</h4>
							<hr>
							<div class="row">
								<div class="col-md-6">
									<div class="form-group"
										 :class="{'has-error': errors.user && errors.user['first_name']}">
										<label> First Name</label>
										<input type="text" name="user[first_name]" class="form-control input-lg">
										<span class="help-block" v-if="errors.user && errors.user['first_name']">{{ errors.user['first_name'][0] }}</span>
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-group"
										 :class="{'has-error': errors.user && errors.user['last_name']}">
										<label> Last Name</label>
										<input type="text" name="user[last_name]" class="form-control input-lg">
										<span class="help-block" v-if="errors.user && errors.user['last_name']">{{ errors.user['last_name'][0] }}</span>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-6">
									<div class="form-group" :class="{'has-error': errors.user && errors.user['email']}">
										<label> Email</label>
										<input type="email" name="user[email]" class="form-control input-lg">
										<span class="help-block" v-if="errors.user && errors.user['email']">{{ errors.user['email'][0] }}</span>
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-group"
										 :class="{'has-error': errors.user && errors.user['password']}">
										<label> Password</label>
										<input type="password" name="user[password]" class="form-control input-lg">
										<span class="help-block" v-if="errors.user && errors.user['password']">{{ errors.user['password'][0] }}</span>
									</div>
								</div>
							</div>
						</div>
						<h4>Instance - ( {{ instance_limit }} )</h4>
						<hr>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.cpu_cores}">
									<label> CPU Cores</label>
									<div class="input-group">
										<input type="number" name="cpu_cores" class="form-control input-lg">
										<div class="input-group-addon">
											{{ reseller_limits.cpu_cores }}
										</div>
									</div>
									<span class="help-block" v-if="errors.cpu_cores">{{ errors.cpu_cores[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.ram}">
									<label> RAM (in MB)</label>
									<div class="input-group">
										<input type="number" name="ram" class="form-control input-lg">
										<div class="input-group-addon">
											{{ reseller_limits.ram }}MB
										</div>
									</div>
									<span class="help-block" v-if="errors.ram">{{ errors.ram[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.disk_size}">
									<label> Disk (in GB)</label>
									<div class="input-group">
										<input type="number" name="disk_size" class="form-control input-lg">
										<div class="input-group-addon">
											{{ $Gb2Tb(reseller_limits.disk_size) }}
										</div>
									</div>
									<span class="help-block" v-if="errors.disk_size">{{ errors.disk_size[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.snapshot_limit}">
									<label> Snapshot Limit</label>
									<div class="input-group">
										<input type="number" name="snapshot_limit" class="form-control input-lg">
										<div class="input-group-addon">
											{{ reseller_limits.snapshot_limit }}
										</div>
									</div>
									<span class="help-block" v-if="errors.snapshot_limit">{{ errors.snapshot_limit[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.bandwidth}">
									<label> Bandwidth (in GB)</label>
									<div class="input-group">
										<input type="number" name="bandwidth" class="form-control input-lg">
										<div class="input-group-addon">
											{{ $Gb2Tb(reseller_limits.bandwidth) }}
										</div>
									</div>
									<span class="help-block" v-if="errors.bandwidth">{{ errors.bandwidth[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group">
									<label>Network Driver</label>
									<select name="nic_type" class="form-control">
										<option value="virtio">VirtIO</option>
										<option value="rtl8139">Realtek 8139</option>
										<option value="e1000">e1000</option>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.ipv4_count}">
									<label> IPv4 Addresses</label>
									<div class="input-group">
										<input type="number" name="ipv4_count" class="form-control input-lg">
										<div class="input-group-addon">
											{{ reseller_limits.ipv4_count }}
										</div>
									</div>
									<span class="help-block" v-if="errors.ipv4_count">{{ errors.ipv4_count[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.ipv6_count}">
									<label> IPv6 Addresses</label>
									<div class="input-group">
										<input type="number" name="ipv6_count" class="form-control input-lg">
										<div class="input-group-addon">
											{{ reseller_limits.ipv6_count }}
										</div>
									</div>
									<span class="help-block" v-if="errors.ipv6_count">{{ errors.ipv6_count[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.ipv6_subnet_count}">
									<label> IPv6 Subnets</label>
									<div class="input-group">
										<input type="number" name="ipv6_subnet_count" class="form-control input-lg">
										<div class="input-group-addon">
											{{ reseller_limits.ipv6_subnet_count }}
										</div>
									</div>
									<span class="help-block"
										  v-if="errors.ipv6_subnet_count">{{ errors.ipv6_subnet_count[0] }}</span>
								</div>
							</div>
						</div>
						<h4>Image / ISO</h4>
						<hr>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.image_id}">
									<label> Select Image</label>
									<select name="image_id" class="form-control input-lg" data-width="100%">
										<option value=""></option>
									</select>
									<span class="help-block" v-if="errors.image_id">{{ errors.image_id[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.iso_id}">
									<label> Select ISO</label>
									<select name="iso_id" class="form-control input-lg" data-width="100%">
										<option value=""></option>
									</select>
									<span class="help-block" v-if="errors.iso_id">{{ errors.iso_id[0] }}</span>
								</div>
							</div>
						</div>
						<h4>Hostname / Password</h4>
						<hr>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.hostname}">
									<label> Hostname</label>
									<input type="text" name="hostname" class="form-control input-lg">
									<span class="help-block" v-if="errors.hostname">{{ errors.hostname[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.password}">
									<label> Password</label>
									<input type="password" name="password" class="form-control input-lg">
									<span class="help-block" v-if="errors.password">{{ errors.password[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6 firewall-manage">
								<br>
								<button type="submit" class="btn btn-primary normal" :class="{disabled: processing}"
										:disabled="processing">
									<span v-if="processing"><i class="fa fa-spin fa-spinner"></i> Creating</span>
									<span v-else><i class="fa fa-plus"></i> Create </span>
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'user',
	head: {
		title: 'Create Instance',
	},
	validate({store, redirect}) {
		if (store.state.auth.user.is_reseller !== 1) {
			return redirect('/user/instance/create');
		}
		return true;
	},
	data() {
		return {
			reseller_limits: {},
			processing: false,
			user_id: ''
		}
	},
	async asyncData({$axios}) {
		let limits = await $axios.get('/user/reseller/resources');
		return {
			reseller_limits: limits.data.reseller_limits
		}
	},
	methods: {
		create() {
			this.processing = true;
			this.$axios.post('/user/instances', $('form').serialize()).then(() => {
				this.processing = false;
				this.$router.push({name: 'user-dashboard'});
			}).catch(() => {
				this.processing = false;
			});
		}
	},
	mounted() {
		let vm = this;
		$('[name="nic_type"]').select2();
		$('[name="user_id"]').select2({
			placeholder: 'Select User',
			allowClear: true,
			ajax: {
				url: this.$axios.defaults.baseURL + '/user/reseller/subusers',
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
					let users = [];
					data.data.forEach((user) => {
						users.push({id: user.id, text: user.email});
					});
					return {
						results: users
					}
				},
				cache: true
			}
		}).on('change', function () {
			vm.$set(vm,'user_id', this.value);
		});
		$('[name="region_id"]').select2({
			placeholder: 'Select Region',
			allowClear: true,
			ajax: {
				url: vm.$axios.defaults.baseURL + '/user/regions',
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
					let regions = [];
					data.data.forEach((region) => {
						regions.push({id: region.id, text: region.name + ',' + region.country, country: region.country})
					});
					return {
						results: regions
					}
				},
				cache: true
			},

			templateResult: function (state) {
				if (!state.id) {
					return state.text
				}
				let baseUrl = "/flags";
				return $(
					'<span><img src="' + baseUrl + '/' + state.country.toLowerCase() + '.png" style="height:32px;width:32px;border-radius: 20px" /> ' + state.text + '</span>'
				);
			},
			templateSelection: function (state) {
				if (!state.id) {
					return state.text
				}
				let baseUrl = "/flags";
				return $(
					'<span><img src="' + baseUrl + '/' + state.country.toLowerCase() + '.png" style="height:32px;width:32px;border-radius: 20px" /> ' + state.text + '</span>'
				);
			},
			escapeMarkup: function (m) {
				return m;
			}
		}).on('change', function () {

		});
		$('[name="iso_id"]').select2({
			placeholder: 'Select ISO',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/user/isos',
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
					let isos = [];
					data.data.forEach((iso) => {
						isos.push({id: iso.id, text: iso.name, distro: iso.distro})
					});
					return {
						results: isos
					}
				},
				cache: true
			},

			templateResult: function (state) {
				if (!state.id) {
					return state.text
				}
				let baseUrl = "/assets";
				return $(
					'<span><img src="' + baseUrl + '/' + state.distro.image + '" style="height:32px;width:32px" /> ' + state.text + '</span>'
				);
			},
			templateSelection: function (state) {
				if (!state.id) {
					return state.text
				}
				let baseUrl = "/assets";
				return $(
					'<span><img src="' + baseUrl + '/' + state.distro.image + '" style="height:32px;width:32px" /> ' + state.text + '</span>'
				);
			},
			escapeMarkup: function (m) {
				return m;
			}
		});
		$('[name="image_id"]').select2({
			placeholder: 'Select Image',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/user/images',
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
					let isos = [];
					data.data.forEach((iso) => {
						isos.push({id: iso.id, text: iso.name, distro: iso.distro})
					});
					return {
						results: isos
					}
				},
				cache: true
			},

			templateResult: function (state) {
				if (!state.id) {
					return state.text
				}
				let baseUrl = "/assets";
				return $(
					'<span><img src="' + baseUrl + '/' + state.distro.image + '" style="height:32px;width:32px" /> ' + state.text + '</span>'
				);
			},
			templateSelection: function (state) {
				if (!state.id) {
					return state.text
				}
				let baseUrl = "/assets";
				return $(
					'<span><img src="' + baseUrl + '/' + state.distro.image + '" style="height:32px;width:32px" /> ' + state.text + '</span>'
				);
			},
			escapeMarkup: function (m) {
				return m;
			}
		});
	},
	computed: {
		user_limit() {
			return this.reseller_limits.user_count === -1 ? 'Unlimited' : this.reseller_limits.user_count + ' left';
		},
		instance_limit() {
			return this.reseller_limits.instance_count === -1 ? 'Unlimited' : this.reseller_limits.instance_count + ' left';
		}
	}
}
</script>
