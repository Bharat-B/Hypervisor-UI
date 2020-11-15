<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-hdd" aria-hidden="true"></i> Update storage</h2>
		<div class="col-md-10">
			<form @submit.prevent="update">
				<div class="box storage">
					<div class="row">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.name}">
							<input type="text" class="form-control" placeholder="Name" name="name"
								   v-model="storage.name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Class:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.disk}">
							<select class="choose form-control" name="disk_type">
								<option value="hdd">HDD</option>
								<option value="ssd">SSD</option>
								<option value="ssd_cached">SSD Cached</option>
								<option value="NVMe">NVMe</option>
							</select>
							<span class="help-block" v-if="errors.disk">{{ errors.disk[0] }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-md-2">
							<h5>Type:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.type}">
							<select class="choose form-control" name="type" v-model="storage.type">
								<option value="block">LVM</option>
								<option value="thin_block">Thin LVM</option>
								<option value="file">File</option>
							</select>
							<span class="help-block" v-if="errors.type">{{ errors.type[0] }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-md-2">
							<h5>Format:</h5>
						</div>
						<div class="col-md-3 form-group" :class="{'has-error': errors.format}">
							<select class="choose form-control" name="format" v-model="storage.format">
								<option value="raw">RAW</option>
								<option value="qcow2">QCOW2</option>
							</select>
							<span class="help-block" v-if="errors.format">{{ errors.format[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Path:</h5>
						</div>
						<div class="col-md-3 form-group" :class="{'has-error': errors.path}">
							<input type="text" class="form-control" :placeholder="storage_location"
								   v-model="storage.path">
							<span class="help-block" v-if="errors.path">{{ errors.path[0] }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-md-2">
							<h5>Hypervisor:</h5>
						</div>

						<div class="col-md-3 form-group" :class="{'has-error': errors.hypervisor_id}">
							<select class="form-control" name="hypervisor_id"></select>
							<span class="help-block" v-if="errors.hypervisor_id">{{ errors.hypervisor_id[0] }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-md-2">
							<h5>Locked:</h5>
						</div>
						<div class="col-md-3">
							<input type="hidden" name="locked" value="0">
							<input type="checkbox" name="locked" id="is_locked" value="1"
								   :checked="storage.locked === 1">
							<label class="switchy" for="is_locked"></label>
						</div>
					</div>

					<div class="row">
						<div class="col-md-2">
							<h5>Primary:</h5>
						</div>
						<div class="col-md-3">
							<input type="hidden" name="primary" value="0">
							<input type="checkbox" name="primary" id="is_primary" value="1"
								   :checked="storage.primary === 1">
							<label class="switchy" for="is_primary"></label>
						</div>
					</div>
					<br/><br/>
					<button class="btn btn-primary" type="submit" :disabled="processing">
						<i v-if="!processing" class="fa fa-edit" aria-hidden="true"></i>
						<i v-else class="fa fa-spin fa-spinner"></i>
						Update Storage
					</button>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Edit Storage'
	},
	data() {
		return {
			processing: false,
			storage: {}
		}
	},
	methods: {
		update() {
			this.$set(this, 'processing', true);
			this.$axios.patch('/admin/storages/' + this.storage.id, $('form').serialize()).then((response) => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			})
		}
	},
	asyncData({$axios, route}) {
		return $axios.get('/admin/storages/' + route.params.id).then((response) => {
			return {
				storage: response.data
			}
		}).catch((error) => {
		})
	},
	mounted() {
		let vm = this;
		$('[name="format"]').select2({placeholder: 'Select Format'}).val(this.storage.format).trigger('change');
		$('[name="type"]').select2({placeholder: 'Select Type'}).on('change', function () {
			vm.storage.type = this.value;
			return true;
		}).val(this.storage.type).trigger('change');
		$('[name="disk_type"]').select2({placeholder: 'Select Disk'}).val(this.storage.disk_type).trigger('change');
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
						if (hypervisor.id !== vm.form.hypervisor_id) {
							hypervisors.push({
								id: hypervisor.id,
								text: ' (' + hypervisor.name + ') - ' + hypervisor.ip,
								hypervisor: hypervisor
							});
						}
					});
					return {
						results: hypervisors
					}
				},
				cache: true
			},
			data: [{
				id: this.storage.hypervisor_id,
				text: ' (' + this.storage.hypervisor.name + ') - ' + this.storage.hypervisor.ip,
				selected: true
			}]

		}).on('change', function () {
			vm.$set(vm.form, 'hypervisor_id', this.value);
		});
	},
	computed: {
		storage_location() {
			let array = {};
			array['block'] = "/dev/<vg_name>";
			array['thin_block'] = "/dev/<vg_name>/<thinpool_name>";
			array['file'] = "/root or /mnt";
			return array[this.storage.type];
		}
	}
}
</script>
