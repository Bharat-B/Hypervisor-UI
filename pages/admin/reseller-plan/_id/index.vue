<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-list" aria-hidden="true"></i> Update Reseller Plan</h2>
		<div class="col-md-6">
			<div class="box storage user">
				<form @submit.prevent="update">
					<h4>General Settings</h4>
					<div class="row">
						<div class="col-md-4">
							<div class="form-group" :class="{'has-error': errors.name}">
								<label> Plan Name</label>
								<input type="text" name="name" class="form-control" v-model="reseller_plan.name">
								<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group" :class="{'has-error': errors.user_count}">
								<label> User Count</label>
								<input type="number" name="user_count" class="form-control"
									   v-model="reseller_plan.user_count">
								<span class="help-block" v-if="errors.user_count">{{ errors.user_count[0] }}</span>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group" :class="{'has-error': errors.instance_count}">
								<label> Instance Count</label>
								<input type="number" name="instance_count" class="form-control"
									   v-model="reseller_plan.instance_count">
								<span class="help-block" v-if="errors.instance_count">{{errors.instance_count[0]}}</span>
							</div>
						</div>
					</div>
					<br>
					<h4>CPU & RAM Settings</h4>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.ram}">
								<label> RAM</label>
								<div class="input-group">
									<input type="number" name="ram" class="form-control" v-model="reseller_plan.ram">
									<div class="input-group-addon">
										MB
									</div>
									<span class="help-block" v-if="errors.ram">{{ errors.ram[0] }}</span>
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label> CPU Cores</label>
								<input type="number" name="cpu_cores" class="form-control" v-model="reseller_plan.cpu_cores">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label> CPU Units</label>
								<input type="number" name="cpu_units" class="form-control" v-model="reseller_plan.cpu_units">
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label> CPU Percent</label>
								<input type="number" name="cpu_percent" class="form-control"
									   v-model="reseller_plan.cpu_percent">
							</div>
						</div>
					</div>
					<h4>Storage Settings</h4>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.disk_size}">
								<label> Disk Storage</label>
								<div class="input-group">
									<input type="number" name="disk_size" class="form-control"
										   v-model="reseller_plan.disk_size">
									<div class="input-group-addon">
										GB
									</div>
								</div>
								<span class="help-block" v-if="errors.disk_size">{{ errors.disk_size[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Provision Disk</label>
								<select name="disk_type" class="form-control">
									<option value="any">Any</option>
									<option value="hdd">HDD</option>
									<option value="sas">SAS</option>
									<option value="ssd_cached">SSD Cached</option>
									<option value="ssd">SSD</option>
									<option value="nvme">NVMe</option>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div
							:class="{'col-md-4': disk_driver === 'virtio-scsi', 'col-md-6': disk_driver !== 'virtio-scsi'}">
							<div class="form-group" :class="{'has-error': errors.disk_driver}">
								<label> Disk Driver</label>
								<select name="disk_driver" class="form-control" data-width="100%">
									<option value="ide">IDE</option>
									<option value="virtio">Virtio</option>
									<option value="virtio-scsi">Virtio SCSI</option>
									<option value="scsi">SCSI</option>
								</select>
							</div>
						</div>
						<div
							:class="{'col-md-4': disk_driver === 'virtio-scsi', 'col-md-6': disk_driver !== 'virtio-scsi'}">
							<div class="form-group" :class="{'has-error': errors.disk_cache}">
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
							<div class="form-group" :class="{'has-error': errors.disk_discard}">
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
								<select name="io_mode" class="form-control" data-width="100%">
									<option value="native">Native</option>
									<option value="threads">Threads</option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Total IOPS</label>
								<input type="number" name="io_total" class="form-control"
									   v-model="reseller_plan.io_total">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>I/O Reads</label>
								<div class="input-group">
									<input type="number" name="io_reads" class="form-control"
										   v-model="reseller_plan.io_reads">
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
									<input type="number" name="io_writes" class="form-control"
										   v-model="reseller_plan.io_writes">
									<div class="input-group-addon">
										MB/s
									</div>
								</div>
							</div>
						</div>
					</div>
					<br>
					<h4>Network Settings</h4>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label> Bandwidth</label>
								<div class="input-group">
									<input type="number" name="bandwidth" class="form-control"
										   v-model="reseller_plan.bandwidth">
									<div class="input-group-addon">
										GB
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.bandwidth_accounting}">
								<label>Bandwidth Accounting</label>
								<select name="bandwidth_accounting" class="form-control" data-width="100%">
									<option value=""></option>
									<option value="uploads">Uploads</option>
									<option value="downloads">Downloads</option>
									<option value="both">Both</option>
								</select>
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
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>IPv4</label>
								<input type="number" name="ipv4_count" class="form-control"
									   v-model="reseller_plan.ipv4_count">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>IPv6 Addresses</label>
								<input type="number" name="ipv6_count" class="form-control"
									   v-model="reseller_plan.ipv6_count">
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>IPv6 Subnets</label>
								<input type="number" name="ipv6_subnet_count" class="form-control"
									   v-model="reseller_plan.ipv6_subnet_count">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>Upload Speed</label>
								<div class="input-group">
									<input type="number" name="upload_speed" class="form-control"
										   v-model="reseller_plan.upload_speed">
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
									<input type="number" name="download_speed" class="form-control"
										   v-model="reseller_plan.download_speed">
									<div class="input-group-addon">
										Mbit/s
									</div>
								</div>
							</div>
						</div>
					</div>
					<br>
					<h4>Other Settings</h4>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>Snapshot Limit</label>
								<input type="number" name="snapshot_limit" class="form-control" v-model="reseller_plan.snapshot_limit">
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Regions</label>
								<select name="regions[]" class="form-control" multiple="multiple" data-width="100%">
									<option value=""></option>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>Image Groups</label>
								<select name="image_groups[]" class="form-control" multiple="multiple"
										data-width="100%">
									<option value=""></option>
								</select>
							</div>
						</div>
						<div class="col-md-6" v-if="enabledBilling">
							<div class="form-group" :class="{'has-error': errors.price}">
								<label>Price</label>
								<div class="input-group">
									<div class="input-group-addon">
										{{ currencySymbol[environment.settings.currency_code] }}
									</div>
									<input type="text" name="price" class="form-control" v-model="reseller_plan.price">
									<div class="input-group-addon">
										/mo
									</div>
								</div>
								<span class="help-block" v-if="errors.price">{{ errors.price[0] }}</span>
							</div>
						</div>
					</div>
					<br/>
					<button class="btn btn-primary" type="submit" :disabled="processing">
						<i v-if="!processing" class="fa fa-edit" aria-hidden="true"></i>
						<i v-else class="fa fa-spin fa-spinner"></i>
						Update Plan
					</button>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Edit Reseller Plan'
	},
	data() {
		return {
			bandwidth_overage: '',
			processing: false,
			disk_driver: 'ide',
			reseller_plan: {},
			regions: [],
			image_groups: []
		}
	},
	async asyncData({$axios, route}) {
		let response = await $axios.get('/admin/reseller-plans/' + route.params.id), regions = [], image_groups = [];
		if (response.data.regions.length > 0) {
			response.data.regions.forEach((region) => {
				regions.push({id: region.id, text: region.name, selected: true});
			})
		}
		if (response.data.image_groups.length > 0) {
			response.data.image_groups.forEach((image_group) => {
				image_groups.push({id: image_group.id, text: image_group.name, selected: true});
			})
		}
		return {
			reseller_plan: response.data,
			regions: regions,
			image_groups: image_groups
		}
	},
	methods: {
		update() {
			this.processing = true;
			this.$axios.patch('/admin/reseller-plans/' + this.reseller_plan.id, $('form').serialize()).then((response) => {
				this.processing = false;
			}).catch((error) => {
				this.processing = false;
			});
		}
	},
	mounted() {
		let vm = this;
		$('[name="bandwidth_accounting"]').select2({placeholder: 'Select Accounting'}).val(this.reseller_plan.bandwidth_accounting).trigger('change');
		$('[name="bandwidth_overage"]').select2({placeholder: 'Overage Action'}).on('change', function () {
			vm.bandwidth_overage = this.value;
		}).val(this.reseller_plan.bandwidth_overage).trigger('change');
		$('[name="disk_driver"]').select2({placeholder: 'Select Accounting'}).on('change', function () {
			vm.$set(vm, 'disk_driver', this.value);
		}).val(this.reseller_plan.disk_driver).trigger('change');
		$('[name="disk_cache"]').select2({placeholder: 'Select Cache'}).val(this.reseller_plan.disk_cache).trigger('change');
		$('[name="disk_discard"]').select2({placeholder: 'Select Discard'}).val(this.reseller_plan.disk_discard).trigger('change');
		$('[name="disk_type"]').select2({placeholder: 'Select Type'}).val(this.reseller_plan.disk_type).trigger('change');


		$('[name="regions[]"]').select2({
			placeholder: 'Select Region',
			ajax: {
				url: this.$axios.defaults.baseURL + '/admin/regions',
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
						regions.push({id: region.id, text: region.name});
					});
					return {
						results: regions
					}
				},
				cache: true
			},
			data: this.regions
		});
		$('[name="image_groups[]"]').select2({
			placeholder: 'Select Groups',
			ajax: {
				url: this.$axios.defaults.baseURL + '/admin/image-groups',
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
					let groups = [];
					data.data.forEach((group) => {
						groups.push({id: group.id, text: group.name});
					});
					return {
						results: groups
					}
				},
				cache: true
			},
			data: this.image_groups
		});
	}
}
</script>
