<template>
	<div class="content animated fadeIn newinstances">
		<h2><i class="fa fa-th-large" aria-hidden="true"></i> Edit Instance</h2>
		<div class="row">
			<form @submit.prevent="update">
				<div class="col-md-6">
					<input type="hidden" name="instance_edit" value="1">
					<div class="box storage">
						<h4>General settings</h4>
						<div class="row">
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.user_id}">
									<label>User</label>
									<select2 v-bind:name="'user_id'" v-bind:allowclear="'true'" v-once></select2>
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.hypervisor_id}">
									<label>Hypervisor</label>
									<p>{{ [hypervisor.name, hypervisor.ip].join(' - ') }}</p>
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.plan_id}">
									<label>Plan</label>
									<select2 v-bind:name="'plan_id'" v-bind:allowclear="'true'" v-once></select2>
								</div>
							</div>
						</div>
						<br>
						<h4>CPU & RAM Settings</h4>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.ram}">
									<label>Ram</label>
									<div class="input-group">
										<input type="text" name="ram" class="form-control" v-model="instance.ram">
										<div class="input-group-addon">MB</div>
									</div>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.cpu_cores}">
									<label> CPU Cores</label>
									<input type="number" name="cpu_cores" class="form-control"
										   v-model="instance.cpu_cores">
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.cpu_units}">
									<label> CPU Units</label>
									<input type="number" name="cpu_units" class="form-control"
										   v-model="instance.cpu_units">
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.cpu_percent}">
									<label> CPU Percent</label>
									<input type="number" name="cpu_percent" class="form-control"
										   v-model="instance.cpu_percent">
								</div>
							</div>
						</div>
						<br>
						<h4>Disk Settings</h4>
						<div class="row">
							<div class="col-md-12">
								<div class="form-group">
									<label>Disk</label>
									<div class="row">
										<div class="col-md-6">
											<div class="form-group" :class="{'has-error': errors['storages.0']}">
												<select2 v-bind:name="'storages['+instance.disks[0].id+']'"
														 v-bind:allowclear="'false'" v-once></select2>
											</div>
										</div>
										<div class="col-md-6">
											<div class="form-group" :class="{'has-error': errors['disks.0']}">
												<div class="input-group">
													<input type="text" class="form-control" :name="'disks['+instance.disks[0].id+']'" v-model="instance.disks[0].size">
													<span class="input-group-addon">GB</span>
													<span class="input-group-btn">
                                                        <button class="btn btn-default" type="button" @click.prevent="addDisk"><i class="fa fa-plus" aria-hidden="true"></i></button>
                                                    </span>
												</div>
											</div>
										</div>
									</div>
									<disk v-for="$disk in diskarr" v-bind:disk="$disk" v-bind:storages="storages" v-bind:instance="instance" v-on:removedisk="removeDisk" :key="$disk"></disk>
								</div>
							</div>
						</div>
						<div class="row">
							<div :class="{'col-md-4': disk_driver === 'virtio-scsi', 'col-md-6': disk_driver !== 'virtio-scsi'}">
								<div class="form-group">
									<label> Disk Driver</label>
									<select name="disk_driver" class="form-control" data-width="100%">
										<option value="virtio">Virtio</option>
										<option value="virtio-scsi">Virtio SCSI</option>
										<option value="ide">IDE</option>
										<option value="scsi">SCSI</option>
									</select>
								</div>
							</div>
							<div
								:class="{'col-md-4': disk_driver === 'virtio-scsi', 'col-md-6': disk_driver !== 'virtio-scsi'}">
								<div class="form-group">
									<label> Disk Cache</label>
									<select name="disk_cache" class="form-control" data-width="100%">
										<option value="none">Default</option>
										<option value="writethrough">Write Through</option>
										<option value="writeback">Write Back</option>
										<option value="directsync">Direct Sync</option>
									</select>
								</div>
							</div>
							<div class="col-md-4" v-show="disk_driver === 'virtio-scsi'">
								<div class="form-group">
									<label> Disk Discard</label>
									<select name="disk_discard" class="form-control" data-width="100%">
										<option value="none">None</option>
										<option value="unmap">Unmap</option>
									</select>
								</div>
							</div>
						</div>
						<br>
						<h4>I/O Settings</h4>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label>I/O Mode</label>
									<select name="io_mode" class="form-control" v-model="instance.io_mode">
										<option value="native">Native</option>
										<option value="native">Threads</option>
									</select>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group">
									<label>Total IOPS</label>
									<input type="number" name="io_total" class="form-control" v-model="instance.io_total">
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label>I/O Reads</label>
									<div class="input-group">
										<input type="number" name="io_reads" class="form-control" v-model="instance.io_reads">
										<div class="input-group-addon">
											MB/s
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group">
									<label>I/O Writes</label>
									<div class="input-group">
										<input type="number" name="io_writes" class="form-control" v-model="instance.io_writes">
										<div class="input-group-addon">
											MB/s
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="box storage">
						<h4>Network Settings</h4>
						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Bandwidth</label>
									<div class="input-group">
										<input type="text" name="bandwidth" class="form-control" placeholder="0" v-model="instance.bandwidth">
										<div class="input-group-addon">GB</div>
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Additional Bandwidth</label>
									<div class="input-group">
										<input type="text" name="additional_bandwidth" class="form-control" placeholder="0" v-model="instance.additional_bandwidth">
										<div class="input-group-addon">GB</div>
									</div>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.bandwidth_accounting}">
									<label>Bandwidth Accounting</label>
									<select name="bandwidth_accounting" class="form-control" data-width="100%" v-model="instance.bandwidth_accounting">
										<option value=""></option>
										<option value="uploads">Uploads</option>
										<option value="downloads">Downloads</option>
										<option value="both">Both</option>
									</select>
									<span class="help-block" v-if="errors.bandwidth_accounting">{{ errors.bandwidth_accounting[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.bandwidth_overage}">
									<label>Overage Action</label>
									<select name="bandwidth_overage" class="form-control" data-width="100%">
										<option value=""></option>
										<option value="suspend_network">Suspend Network</option>
										<option value="suspend_instance">Suspend Instance</option>
										<option value="billing">Bill Overage</option>
									</select>
									<span class="help-block" v-if="errors.bandwidth_overage">{{ errors.bandwidth_overage[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.overage_price}">
									<label>Bandwidth Overage Price</label>
									<div class="input-group">
										<div class="input-group-addon">
											{{ currencySymbol[environment.settings.currency_code] }}
										</div>
										<input type="text" name="overage_price" class="form-control" v-model="instance.overage_price" :disabled="!enabledBilling || bandwidth_overage !== 'billing'">
										<div class="input-group-addon">/GB</div>
									</div>
									<span class="help-block" v-if="errors.overage_price">{{errors.overage_price[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label>Upload Speed</label>
									<div class="input-group">
										<input type="number" name="upload_speed" class="form-control" v-model="instance.upload_speed">
										<div class="input-group-addon">
											Mbit/s
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group">
									<label>Download Speed</label>
									<div class="input-group">
										<input type="number" name="download_speed" class="form-control" v-model="instance.download_speed">
										<div class="input-group-addon">
											Mbit/s
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<label>Public IPv4</label>
								<select class="form-control" id="ipv4" name="ips[]" multiple="multiple">

								</select>
							</div>
							<div class="col-md-6">
								<label>Public IPv6</label>
								<select class="form-control" id="ipv6" name="ips[]" multiple="multiple">

								</select>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<label>Private Networking</label>
								<div>
									<input type="checkbox" value="0" name="enabled_internal"/>
									<input type="checkbox" value="1" id="enabled_internal" name="enabled_internal" v-model="instance.enabled_internal"/>
									<label class="switchy" for="enabled_internal"></label>
								</div>
							</div>
							<div class="col-md-6">
								<label>Private IPv4</label>
								<select class="form-control" id="pipv4" name="ips[]">

								</select>
							</div>
						</div>
						<br>
						<h4>VNC Settings</h4>
						<div class="row">
							<div class="col-md-6">
								<label>Enable noVNC</label>
								<div>
									<input type="checkbox" value="0" name="vnc"/>
									<input type="checkbox" value="1" id="vnc" name="vnc"
										   :checked="instance.vnc == '1'"/>
									<label class="switchy" for="vnc"></label>
								</div>
							</div>
							<div class="col-md-6">
								<label>VNC Keymap</label>
								<select name="vnc_keymap" class="form-control" v-model="instance.vnc_keymap">
									<option value="en-us">en-us</option>
									<option value="de-ch">de-ch</option>
									<option value="ar">ar</option>
									<option value="da">da</option>
									<option value="et">et</option>
									<option value="fo">fo</option>
									<option value="fr-be">fr-be</option>
									<option value="fr-ch">fr-ch</option>
									<option value="hu">hu</option>
									<option value="it">it</option>
									<option value="lt">lt</option>
									<option value="mk">mk</option>
									<option value="nl">nl</option>
									<option value="no">no</option>
									<option value="pt">pt</option>
									<option value="ru">ru</option>
									<option value="sv">sv</option>
									<option value="tr">tr</option>
									<option value="de">de</option>
									<option value="en-gb">en-gb</option>
									<option value="es">es</option>
									<option value="fi">fi</option>
									<option value="fr">fr</option>
									<option value="fr-ca">fr-ca</option>
									<option value="hr">hr</option>
									<option value="is">is</option>
									<option value="ja">ja</option>
									<option value="lv">lv</option>
									<option value="nl-be">nl-be</option>
									<option value="pl">pl</option>
									<option value="pt-br">pt-br</option>
									<option value="sl">sl</option>
									<option value="th">th</option>
								</select>
							</div>
						</div>
						<span v-if="enabledBilling">
                            <br>
                            <h4>Billing Settings</h4>
                            <div class="row">
                                <div class="col-md-6">
                                    <label>Enable Billing</label>
                                    <div>
                                        <input type="checkbox" value="0" name="enabled_billing"/>
                                        <input type="checkbox" value="1" id="enabled_billing" name="enabled_billing"
											   :checked="instance.enabled_billing === 1"/>
                                        <label class="switchy" for="enabled_billing" :disabled="!enabledBilling"
											   :class="{disabled: !enabledBilling}"></label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group" :class="{'has-error': errors.overage_price}">
                                        <label>Price</label>
                                        <div class="input-group">
                                            <div class="input-group-addon">{{currencySymbol[environment.settings.currency_code] }}</div>
                                            <input type="text" name="price" class="form-control" v-model="instance.price" :disabled="!enabledBilling">
                                            <div class="input-group-addon">/hr</div>
                                        </div>
                                        <span class="help-block" v-if="errors.overage_price">{{errors.overage_price[0] }}</span>
                                    </div>
                                </div>
                            </div>
                        </span>
						<div class="row">
							<div class="col-md-6">
								<button type="submit" class="btn btn-primary"><i class="fa fa-edit"></i> Update</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
import DiskRule from "~/components/instance/disk.vue";
import Select2 from "~/components/bootstrap/select2.vue";

export default {
	'layout': 'admin',
	head: {
		title: 'Edit Instance'
	},
	components: {
		'disk': DiskRule,
		'select2': Select2
	},
	watch: {
		storages() {
			let vm = this;
			let storage = $('[name="storages[0]"]');
			if (storage.hasClass('select2-hidden-accessible')) {
				storage.empty();
			}
			storage.select2({placeholder: "Select Storage", data: vm.storages});
		},
		plan(plan) {
			let vm = this;
			$.each(plan, (k, v) => {
				if (k === 'ipv4_count') {
					let ipv4 = [];
					for (let i = 0; i < v; i++) {
						ipv4.push(vm.public_ipv4[i].id);
					}
					$('#ipv4').val(ipv4).trigger('change');
				} else if (k === 'ipv6_count') {
					let ipv6 = [];
					for (let i = 0; i < v; i++) {
						ipv6.push(vm.public_ipv6[i].id);
					}
					$('#ipv6').val(ipv6).trigger('change');
				} else if (k === 'disk_size') {
					if (plan['disk_type'] === 'any') {
						vm.storages.forEach((item) => {
							if (item.storage.free >= v && item.storage.locked === 0) {
								$('[name="storage[0]"]').val(item.id);
							}
						});
					} else {
						vm.storages.forEach((item) => {
							if (item.storage.free >= v && item.storage.disk_type === plan['disk_type'] && item.storage.locked === 0) {
								$('[name="storage[0]"]').val(item.id);
							}
						});
					}
					$('[name="disks[0]"]').val(v);
				} else {
					$('[name="' + k + '"]').val(v).trigger('change');
				}
			});
		}
	},
	data() {
		return {
			disk_driver: '',
			bandwidth_overage: '',
			hypervisor_id: '',
			plan_id: '',
			hypervisor: {},
			plan: {},
			regions: [],
			storages: [],
			plan_image: {},
			diskcount: 0,
			diskarr: [],
			instance: {},
			public_ipv4: [],
			public_ipv6: [],
			private_ipv4: [],
			selected_ips: []
		}
	},
	methods: {
		addDisk() {
			this.diskcount++;
			this.diskarr.push(this.diskcount);
		},
		removeDisk(i) {
			$('#disk-' + i).remove();
		},
		async update() {
			await this.$axios.patch('/admin/instance/' + this.$route.params.id, $('form').serialize()).catch(() => {
			});
		}
	},
	async asyncData({$axios, route, redirect}) {
		let instance = await $axios.get('/admin/instances/' + route.params.id).catch(() => {
			redirect('/admin/instances');
		});

		let plan = await $axios.get('/admin/plans/' + instance.data.plan_id).catch(() => {
		});

		let hypervisor = await $axios.get('/admin/hypervisors/' + instance.data.hypervisor_id).catch(() => {
		});

		let public_ipv4 = [], public_ipv6 = [], private_ipv4 = [], storages = [], ips = [], regions = [], diskcount = 0,
			diskarr = [];

		instance.data.disks.forEach((disk, k) => {
			if (k !== 0) {
				diskcount++;
				diskarr.push(diskcount);
			}
		});
		if (hypervisor.data.region.length > 0) {
			hypervisor.data.region.forEach((region) => {
				regions.push(region.id);
			})
		}
		if (hypervisor.data.storage.length > 0) {
			hypervisor.data.storage.forEach((storage) => {
				storages.push({
					id: storage.id,
					text: storage.name + ' - ' + storage.free + ' GB',
					storage: storage,
					selected: instance.data.disks[0].hypervisor_storage_id === storage.id
				});
			});
		}
		if (hypervisor.data.networks.length > 0) {
			hypervisor.data.networks.forEach((network) => {
				if (network.type === 'public' && network.version === 'v4' && network.free > 0) {
					network.ips.forEach((ip) => {
						if (ip.status === 'free') {
							public_ipv4.push({id: ip.id, text: ip.ip});
						}
					});
				}
				if (network.type === 'public' && (network.version === 'v6' || network.version === 'v6_subnet') && network.free > 0) {
					network.ips.forEach((ip) => {
						if (ip.status === 'free') {
							public_ipv6.push({
								id: ip.id,
								text: ip.version === 'v6_subnet' ? ip.ip + '/' + ip.ip_mask : ip.ip
							});
						}
					});
				}
				if (network.type === 'private' && network.version === 'v4' && network.free > 0) {
					network.ips.forEach((ip) => {
						if (ip.status === 'free') {
							private_ipv4.push({id: ip.id, text: ip.ip});
						}
					});
				}
			})
		}
		instance.data.ips.forEach((ip) => {
			if (ip.version === 'v4') {
				public_ipv4.push({id: ip.id, text: ip.ip, selected: true})
			}
			if (ip.version === 'v6' || ip.version === 'v6_subnet') {
				public_ipv6.push({
					id: ip.id,
					text: ip.version === 'v6_subnet' ? ip.ip + '/' + ip.ip_mask : ip.ip,
					selected: true
				})
			}
			if (ip.type === 'private' && ip.version === 'v4') {
				private_ipv4.push({id: ip.id, text: ip.ip, selected: true})
			}
		});
		return {
			instance: instance.data,
			plan: plan ? plan.data : {},
			hypervisor: hypervisor.data,
			public_ipv4: public_ipv4,
			public_ipv6: public_ipv6,
			private_ipv4: private_ipv4,
			storages: storages,
			selected_ips: ips,
			regions: regions,
			diskarr: diskarr,
			diskcount: diskcount
		}
	},
	mounted() {
		let vm = this;
		$('[name="bandwidth_overage"]').select2({placeholder: 'Overage Action'}).val(vm.instance.bandwidth_overage).on('change', function () {
			vm.bandwidth_overage = this.value;
		}).trigger('change');
		$('[name="bandwidth_accounting"]').select2({placeholder: 'Select Accounting'});
		$('[name="disk_driver"]').select2({placeholder: 'Select Driver'}).val(vm.instance.disk_driver).on('change', function () {
			vm.disk_driver = this.value;
		}).trigger('change');
		$('[name="disk_cache"]').select2({placeholder: 'Select Cache'}).val(vm.instance.disk_cache).trigger('change');
		$('[name="disk_discard"]').select2({placeholder: 'Select Discard'}).val(vm.instance.disk_discard).trigger('change');
		$('[name="disk_type"]').select2({placeholder: 'Select Discard'});
		$('[name="user_id"]').select2({
			placeholder: 'Select User',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/users',
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
						users.push({id: user.id, text: [user.first_name, user.last_name].join(' '), user: user});
					});
					return {
						results: users
					}
				},
				cache: true
			},
			data: [{
				id: vm.instance.user_id,
				text: [vm.instance.user.first_name, vm.instance.user.last_name].join(' '),
				user: vm.instance.user,
				selected: true
			}]
		});
		$('[name="storages[' + this.instance.disks[0].id + ']"]').select2({
			placeholder: 'Select Storage',
			data: vm.storages
		});
		let plan = [];
		if (vm.plan.id) {
			plan.push({id: vm.plan.id, text: vm.plan.name, plan: vm.plan, selected: true});
		}
		$('[name="plan_id"]').select2({
			placeholder: 'Select Plan',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/plans',
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
					let plans = [];
					data.data.forEach((plan) => {
						if (plan.regions.length > 0 && vm.regions.length > 0) {
							plan.regions.forEach((region) => {
								if (vm.regions.indexOf(region.id) !== -1) {
									plans.push({id: plan.id, text: plan.name});
								}
							})
						} else if (vm.regions.length <= 0 || plan.regions.length <= 0) {
							plans.push({id: plan.id, text: plan.name});
						}
					});
					return {
						results: plans
					}
				},
				cache: true
			},
			data: plan
		}).on('change', function () {
			vm.plan_id = this.value;
			if (vm.plan_id !== '') {
				vm.$axios.get('/admin/plans/' + this.value).then((response) => {
					vm.$set(vm, "plan", response.data);
					if (vm.plan.image_id !== '') {
						vm.$set(vm, "plan_image", response.data.image);
						let option = new Option(vm.plan.image.name, vm.plan.image_id, true, true);
						$('[name="image_id"]').append(option).trigger('change');
					}
					$('[name=""]')
				}).catch(() => {

				});
			} else {
				$('[name="image_id"]').empty();
			}
		});
		$('[name="io_mode"]').select2({placeholder: 'Select Mode'});
		$('[name="vnc_keymap"]').select2({placeholder: 'Select Keymap'});
		let ips = $('#ipv4');
		ips.empty();
		ips.select2({placeholder: "Select IP(s)", data: vm.public_ipv4});

		let ip6s = $('#ipv6');
		ip6s.empty();
		ip6s.select2({placeholder: "Select IP(s)", data: vm.public_ipv6});

		let pips = $('#pipv4');
		pips.empty();
		pips.select2({placeholder: "Select IP(s)", data: vm.private_ipv4});
	}
}
</script>
<style>
.storage .row {
	margin-top: 10px;
}
</style>
