<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-layer-group" aria-hidden="true"></i>Update Instance Plan</h2>
		<div class="col-md-6">
			<div class="box storage user">
				<form @submit.prevent="update">
					<h4>General Settings</h4>
					<div class="row">
						<div class="form-group col-md-4" :class="{'has-error': errors.name}">
							<label>Name:</label>
							<input type="text" name="name" class="form-control" placeholder="Name" v-model="plan.name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
						<div class="form-group col-md-4">
							<label>Sorting:</label>
							<input type="number" name="sort" class="form-control" placeholder="Sort Order"
								   v-model="plan.sort">
						</div>
						<div class="form-group col-md-4">
							<label>Hidden:</label>
							<div>
								<input type="hidden" name="hidden" value="0">
								<input type="checkbox" name="hidden" id="hidden" value="1"
									   :checked="plan.hidden === 1"/>
								<label class="switchy" for="hidden"></label>
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
									<input type="number" name="ram" class="form-control" v-model="plan.ram">
									<div class="input-group-addon">
										MB
									</div>
								</div>
								<span class="help-block" v-if="errors.ram">{{ errors.ram[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.cpu_cores}">
								<label> CPU Cores</label>
								<input type="number" name="cpu_cores" class="form-control" v-model="plan.cpu_cores">
								<span class="help-block" v-if="errors.cpu_cores">{{ errors.cpu_cores[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label> CPU Units</label>
								<input type="number" name="cpu_units" class="form-control" v-model="plan.cpu_units">
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label> CPU Percent</label>
								<input type="number" name="cpu_percent" class="form-control" v-model="plan.cpu_percent">
							</div>
						</div>
					</div>
					<br>
					<h4>Storage Settings</h4>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.disk_size}">
								<label> Disk Storage</label>
								<div class="input-group">
									<input type="number" name="disk_size" class="form-control" v-model="plan.disk_size">
									<div class="input-group-addon">
										GB
									</div>
								</div>
								<span class="help-block" v-if="errors.disk_size">{{ errors.disk_size[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Disk Type</label>
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
							<div class="form-group">
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
								<select name="io_mode" class="form-control">
									<option value="native">Native</option>
									<option value="native">Threads</option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Total IOPS</label>
								<input type="number" name="io_total" class="form-control" v-model="plan.io_total">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>I/O Reads</label>
								<div class="input-group">
									<input type="number" name="io_reads" class="form-control" v-model="plan.io_reads">
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
									<input type="number" name="io_writes" class="form-control" v-model="plan.io_writes">
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
									<input type="number" name="bandwidth" class="form-control" v-model="plan.bandwidth">
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
								<span class="help-block"
									  v-if="errors.bandwidth_accounting">{{ errors.bandwidth_accounting[0] }}</span>
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
								<span class="help-block" v-if="errors.bandwidth_overage">{{
										errors.bandwidth_overage[0]
									}}</span>
							</div>
						</div>
						<div class="col-md-6" v-if="bandwidth_overage === 'billing'">
							<div class="form-group" :class="{'has-error': errors.overage_price}">
								<label>Bandwidth Overage Price</label>
								<div class="input-group">
									<div class="input-group-addon">{{
											currencySymbol[environment.settings.currency_code]
										}}
									</div>
									<input type="number" name="overage_price" class="form-control"
										   :disabled="!enabledBilling" v-model="plan.overage_price">
									<div class="input-group-addon">/GB</div>
								</div>
								<span class="help-block" v-if="errors.overage_price">{{
										errors.overage_price[0]
									}}</span>
							</div>
						</div>
						<div class="col-md-6" v-else>
							<div class="form-group">
								<label>IPv4 Count</label>
								<input type="number" name="ipv4_count" class="form-control" v-model="plan.ipv4_count">
							</div>
						</div>
					</div>
					<div class="row">
						<div v-if="bandwidth_overage === 'billing'" class="col-md-4">
							<div class="form-group">
								<label>IPv4 Count</label>
								<input type="number" name="ipv4_count" class="form-control" v-model="plan.ipv4_count">
							</div>
						</div>
						<div
							:class="{'col-md-6': bandwidth_overage !== 'billing', 'col-md-4': bandwidth_overage === 'billing'}">
							<div class="form-group">
								<label>IPv6 Count</label>
								<input type="number" name="ipv6_count" class="form-control" v-model="plan.ipv6_count">
							</div>
						</div>
						<div
							:class="{'col-md-6': bandwidth_overage !== 'billing', 'col-md-4': bandwidth_overage === 'billing'}">
							<div class="form-group">
								<label>IPv6 Subnet Count</label>
								<input type="number" name="ipv6_subnet_count" class="form-control"
									   v-model="plan.ipv6_subnet_count">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>Upload Speed</label>
								<div class="input-group">
									<input type="number" name="upload_speed" class="form-control"
										   v-model="plan.upload_speed">
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
										   v-model="plan.download_speed">
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
								<label>Regions</label>
								<select name="regions[]" class="form-control" multiple="multiple" data-width="100%">
									<option value=""></option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Image Groups</label>
								<select name="image_groups[]" class="form-control" multiple="multiple"
										data-width="100%">
									<option value=""></option>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>Upgrades</label>
								<select name="upgrades[]" class="form-control" multiple="multiple" data-width="100%">
									<option value=""></option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Default Image</label>
								<select name="image_id" class="form-control" data-width="100%">
									<option value=""></option>
								</select>
							</div>
						</div>
					</div>
					<div class="row" v-if="enabledBilling">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.price}">
								<label>Price</label>
								<div class="input-group">
									<div class="input-group-addon">
										{{ currencySymbol[environment.settings.currency_code] }}
									</div>
									<input type="text" name="price" class="form-control" v-model="plan.price">
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
		title: 'Update Instance Plan'
	},
	data() {
		return {
			bandwidth_overage: '',
			disk_driver: 'ide',
			plan: {},
			regions: [],
			image_groups: [],
			upgrades: [],
			processing: false
		}
	},
	async asyncData({$axios, route}) {
		let response = await $axios.get('/admin/plans/' + route.params.id), regions = [], image_groups = [],
			upgrades = [];
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

		if (response.data.upgrades.length > 0) {
			response.data.upgrades.forEach((plan) => {
				upgrades.push({id: plan.id, text: plan.name, selected: true});
			})
		}

		return {
			plan: response.data,
			regions: regions,
			image_groups: image_groups,
			upgrades: upgrades,
			disk_driver: response.data.disk_driver,
			bandwidth_overage: response.data.bandwidth_overage
		}
	},
	methods: {
		update() {
			this.processing = true;
			this.$axios.patch('/admin/plans/' + this.plan.id, $('form').serialize()).then((response) => {
				this.processing = false;
			}).catch((error) => {
				this.processing = false;
			});
		}
	},
	mounted() {
		let vm = this, regions = [], image_groups = [], upgrades = [];
		$('[name="bandwidth_accounting"]').select2({placeholder: 'Select Accounting'}).val(this.plan.bandwidth_accounting).trigger('change');
		$('[name="bandwidth_overage"]').select2({placeholder: 'Overage Action'}).on('change', function () {
			vm.$set(vm, "bandwidth_overage", this.value);
		}).val(this.plan.bandwidth_overage).trigger('change');
		$('[name="disk_driver"]').select2({placeholder: 'Select Driver'}).on('change', function () {
			vm.$set(vm, 'disk_driver', this.value);
		}).val(this.plan.disk_driver).trigger('change');
		$('[name="io_mode"]').select2({placeholder: 'Select Mode'}).val(this.plan.io_mode).trigger('change');
		$('[name="disk_cache"]').select2({placeholder: 'Select Cache'}).val(this.plan.disk_cache).trigger('change');
		$('[name="disk_discard"]').select2({placeholder: 'Select Discard'}).val(this.plan.disk_discard).trigger('change');
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
		$('[name="upgrades[]"]').select2({
			placeholder: 'Select Upgrades',
			ajax: {
				url: this.$axios.defaults.baseURL + '/admin/plans',
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
						plans.push({id: plan.id, text: plan.name});
					});
					return {
						results: plans
					}
				},
				cache: true
			},
			data: this.upgrades
		});
		$('[name="image_id"]').select2({
			placeholder: 'Select Image (optional)',
			ajax: {
				url: this.$axios.defaults.baseURL + '/admin/images',
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
					let images = [];
					data.data.forEach((image) => {
						images.push({id: image.id, text: image.name});
					});
					return {
						results: images
					}
				},
				cache: true
			}
		});
	}
}
</script>
