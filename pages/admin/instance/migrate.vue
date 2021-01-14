<template>
	<div class="content animated fadeIn newinstances">
		<h2><i class="fa fa-th-large" aria-hidden="true"></i> Migrate Instance</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="migrate">
					<div class="row">
						<div class="form-group" :class="{'has-error': errors.source_hypervisor}">
							<div class="col-md-2">
								<h5>From:</h5>
							</div>
							<div class="col-md-3">
								<select2 v-bind:name="'source_hypervisor'" v-bind:allowclear="'true'" v-once data-width="100%"></select2>
								<span class="help-block" v-if="errors.source_hypervisor">{{ errors.source_hypervisor[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="form-group" :class="{'has-error': errors.instances}">
							<div class="col-md-2">
								<h5>Instances:</h5>
							</div>
							<div class="col-md-3">
								<select2 v-bind:name="'instances[]'" v-bind:allowclear="'true'" v-once></select2>
								<span class="help-block" v-if="errors.instances">{{ errors.instances[0] }}</span>
							</div>
						</div>
					</div>
					<br/><br/>
					<div class="row">
						<div class="form-group" :class="{'has-error': errors.destination_hypervisor}">
							<div class="col-md-2">
								<h5>To:</h5>
							</div>
							<div class="col-md-3">
								<select2 v-bind:name="'destination_hypervisor'" v-bind:allowclear="'true'" v-once></select2>
								<span class="help-block" v-if="errors.destination_hypervisor">{{ errors.destination_hypervisor[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="form-group" :class="{'has-error': errors.destination_storage}">
							<div class="col-md-2">
								<h5>Storage:</h5>
							</div>
							<div class="col-md-3">
								<select2 v-bind:name="'destination_storage'" v-bind:allowclear="'true'" v-once></select2>
								<span class="help-block" v-if="errors.destination_storage">{{ errors.destination_storage[0] }}</span>
							</div>
						</div>
					</div>
					<!--<div class="row">
						<div class="col-md-2">
							<h5>Transfer over Private Network:</h5>
						</div>
						<div class="col-md-3">
							<input type="checkbox" name="transfer_private" id="switch26"/>
							<label class="switchy" for="switch26"/>
						</div>
					</div>-->
					<div class="row">
						<div class="form-group" :class="{'has-error': errors.speed}">
							<div class="col-md-2">
								<h5>Transfer Speed:</h5>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label class="sr-only" for="exampleInputAmount"></label>
									<div class="input-group">
										<input type="number" name="speed" class="form-control" id="exampleInputAmount" placeholder="100">
										<div class="input-group-addon">MBit/s</div>
									</div>
									<span class="help-block" v-if="errors.speed">{{ errors.speed[0] }}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Revoke IP(s):</h5>
						</div>
						<div class="col-md-3">
							<input type="hidden" name="revoke_ips" value="0">
							<input type="checkbox" name="revoke_ips" id="switch15" value="1"/>
							<label class="switchy" for="switch15"/>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Delete Source:</h5>
						</div>
						<div class="col-md-3">
							<input type="hidden" name="delete_source" value="0">
							<input type="checkbox" name="delete_source" id="switch25" value="1"/>
							<label class="switchy" for="switch25"/>
						</div>
					</div>
					<br/><br/>
					<button class="btn btn-primary" type="submit" :disabled="processing">
						<i class="fa fa-plus" aria-hidden="true" v-if="!processing"></i>
						<i class="fa fa-spin fa-spinner" aria-hidden="true" v-else></i>
						Migrate Instance
					</button>
				</form>
			</div>
		</div>
	</div>
</template>
<script>

import Select2 from "~/components/bootstrap/select2.vue";

export default {
	layout: 'admin',
	components: {
		'select2': Select2
	},
	head: {
		title: "Migrate Instance"
	},
	data() {
		return {
			source_hypervisor_id: 0,
			destination_hypervisor_id: 0,
			destination_storages: [],
			destination_storage: 0,
			processing: false
		}
	},
	methods: {
		migrate(){
			let vm = this;
			vm.processing = true;
			this.$axios.post('/admin/migrations',$('form').serialize()).then((response) => {
				vm.processing = false;
				vm.$router.push({name: 'admin-migrations'});
			}).catch((error)=>{
				vm.processing = false;
			})
		}
	},
	asyncData() {

	},
	mounted() {
		let vm = this;
		$('[name="destination_hypervisor"]').select2({
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
						if (hypervisor.locked === 1 || hypervisor.manually_locked === 1 || hypervisor.id === vm.source_hypervisor_id) {

						} else {
							hypervisors.push({id: hypervisor.id, text: [hypervisor.name, hypervisor.ip].join(' - ')});
						}
					});
					return {
						results: hypervisors
					}
				},
				cache: true
			},
		}).on('change', function () {
			let storages = [];
			vm.$set(vm,"destination_hypervisor_id",this.value);
			if(this.value !== 0 && this.value !== ''){
				vm.$axios.get('/admin/hypervisors/'+this.value).then((response) => {
					response.data.storage.forEach((storage) => {
						storages.push({id: storage.id, text: storage.name+' ( '+storage.free+' GB )'})
					});
					$('[name="destination_storage"]').empty().append('<option value="">-- Select --</option>').select2({ placeholder: "Select Destination Storage", data: storages });
				});
			}
		});
		$('[name="source_hypervisor"]').select2({
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
						if (hypervisor.locked === 1 || hypervisor.manually_locked === 1) {

						} else {
							hypervisors.push({id: hypervisor.id, text: [hypervisor.name, hypervisor.ip].join(' - ')});
						}
					});
					return {
						results: hypervisors
					}
				},
				cache: true
			},
		}).on('change', function () {
			$('[name="instances[]"]').empty();
			vm.$set(vm,"source_hypervisor_id",this.value);
		});

		$('[name="instances[]"]').select2({
			placeholder: 'Select Instances',
			tags: true,
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
						hypervisor_id: vm.source_hypervisor_id,
						search: $.trim(params.term),
					}
				},
				processResults: function (data) {
					let instances = [];
					data.data.forEach((instance) => {
						if (instance.hypervisor_id === vm.source_hypervisor_id) {
							instances.push({id: instance.id, text: [instance.hostname, instance.name].join(' - ')});
						}
					});
					return {
						results: instances
					}
				},
				cache: true
			},
		});
	}
}
</script>
