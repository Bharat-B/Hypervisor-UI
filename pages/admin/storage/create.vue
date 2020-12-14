<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-hdd" aria-hidden="true"></i> Create storage</h2>
		<div class="col-md-10">
			<form @submit.prevent="create">
				<div class="box storage">
					<div class="row">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.name}">
							<input type="text" class="form-control" placeholder="Name" name="name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Class:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.disk}">
							<select class="choose form-control" name="disk_type" v-model="disk">
								<option value="hdd">HDD</option>
								<option value="sas">SAS</option>
								<option value="ssd_cached">SSD Cached</option>
								<option value="ssd">SSD</option>
								<option value="nvme">NVMe</option>
							</select>
							<span class="help-block" v-if="errors.disk">{{ errors.disk[0] }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-md-2">
							<h5>Type:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.type}">
							<select class="choose form-control" name="type" v-model="type">
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
							<select class="choose form-control" name="format" v-model="format">
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
							<input type="text" name="path" class="form-control" :placeholder="storage_location">
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
							<input type="hidden" name="is_locked" value="0">
							<input type="checkbox" name="locked" id="is_locked" value="1">
							<label class="switchy" for="is_locked"></label>
						</div>
					</div>

					<div class="row">
						<div class="col-md-2">
							<h5>Primary:</h5>
						</div>
						<div class="col-md-3">
							<input type="hidden" name="is_primary" value="0">
							<input type="checkbox" name="primary" id="is_primary" value="1">
							<label class="switchy" for="is_primary"></label>
						</div>
					</div>
					<br/><br/>
					<button class="btn btn-primary" type="submit" :disabled="processing">
						<i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
						<i v-else class="fa fa-spin fa-spinner"></i>
						Create Storage
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
		title: 'Add Storage'
	},
	data() {
		return {
			processing: false,
			disk: 'hdd',
			format: 'raw',
			type: 'block',
		}
	},
	methods: {
		create() {
			this.processing = true;
			this.$axios.post('/admin/storages', $('form').serialize()).then((response) => {
				this.processing = false;
				this.$router.push({name: 'admin-storage-id', params: {id: response.data.storage.id}});
			}).catch((error) => {
				this.processing = false;
			})
		}
	},
	asyncData() {

	},
	mounted() {
		let vm = this;
		$('[name="disk_type"]').select2({placeholder: 'Select Disk'}).change(function(){
			vm.$set(vm,"disk",this.value);
		});
		$('[name="format"]').select2({placeholder: 'Select Format'}).change(function(){
			vm.$set(vm,"format",this.value);
		});
		$('[name="type"]').select2({placeholder: 'Select Type'}).change(function(){
			vm.$set(vm,"type",this.value);
		});
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
						hypervisors.push({
							id: hypervisor.id,
							text: ' (' + hypervisor.name + ') - ' + hypervisor.ip,
							hypervisor: hypervisor
						});
					});
					return {
						results: hypervisors
					}
				},
				cache: true
			}
		});
	},
	computed: {
		storage_location() {
			let array = {};
			array['block'] = "/dev/<vg_name>";
			array['thin_block'] = "/dev/<vg_name>/<thinpool_name>";
			array['file'] = "/root or /mnt";
			return array[this.type];
		}
	}
}
</script>
