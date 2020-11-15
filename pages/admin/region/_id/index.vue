<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-map-marker" aria-hidden="true"></i> Edit Region</h2>
		<div class="col-md-10">
			<form @submit.prevent="update">
				<div class="box user">
					<div class="row">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.name}">
							<input type="text" class="form-control" placeholder="Name" name="name"
								   v-model="region.name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Select Country:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.country}">
							<select class="choose form-control" name="country" v-model="region.country"></select>
							<span class="help-block" v-if="errors.country">{{ errors.country[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Select Hypervisors:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.hypervisor_id}">
							<select name="hypervisor_id[]" class="form-control" multiple>
								<option value=""></option>
							</select>
							<span class="help-block" v-if="errors.hypervisor_id">{{ errors.hypervisor_id[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Locked:</h5>
						</div>
						<div class="col-md-3" :class="{'has-error': errors.locked}">
							<input type="hidden" name="locked" value="0"/>
							<input type="checkbox" id="is_locked" name="locked" value="1"
								   :checked="region.locked === 1"/>
							<label class="switchy" for="is_locked"></label>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Hidden:</h5>
						</div>
						<div class="col-md-3" :class="{'has-error': errors.hidden}">
							<input type="hidden" name="hidden" value="0"/>
							<input type="checkbox" id="is_hidden" name="hidden" value="1"
								   :checked="region.hidden === 1"/>
							<label class="switchy" for="is_hidden"></label>
						</div>
					</div>
					<!--<div class="row">
						<div class="col-md-2">
							<h5>Resource Pricing:</h5>
						</div>
						<div class="col-md-3">
							<div class="input-group" :class="{'has-error': errors['resource_pricing.cpu']}">
								<span class="input-group-addon">{{ currencySymbol[environment.settings.currency_code] }}</span>
								<input type="text" size="10" name="resource_pricing[cpu]" class="form-control" placeholder="" v-model="region.resource_pricing.cpu || 0">
								<span class="input-group-addon">CPU /vCore</span>
							</div>
							<br />
							<div class="input-group" :class="{'has-error': errors['resource_pricing.ram']}">
								<span class="input-group-addon">{{ currencySymbol[environment.settings.currency_code] }}</span>
								<input type="text" size="10" name="resource_pricing[ram]" class="form-control" placeholder="" v-model="region.resource_pricing.ram || 0">
								<span class="input-group-addon">RAM /GB</span>
							</div>
							<br />
							<div class="input-group" :class="{'has-error': errors['resource_pricing.disk']}">
								<span class="input-group-addon">{{ currencySymbol[environment.settings.currency_code] }}</span>
								<input type="text" size="10" name="resource_pricing[disk]" class="form-control" placeholder="" v-model="region.resource_pricing.disk || 0">
								<span class="input-group-addon">DISK /GB</span>
							</div>
							<br />
							<div class="input-group" :class="{'has-error': errors['resource_pricing.ipv4']}">
								<span class="input-group-addon">{{ currencySymbol[environment.settings.currency_code] }}</span>
								<input type="text" size="10" name="resource_pricing[ipv4]" class="form-control" placeholder="" v-model="region.resource_pricing.ipv4 || 0">
								<span class="input-group-addon">IPv4 /IP</span>
							</div>
							<br/>
							<div class="input-group" :class="{'has-error': errors['resource_pricing.ipv6']}">
								<span class="input-group-addon">{{ currencySymbol[environment.settings.currency_code] }}</span>
								<input type="text" size="10" name="resource_pricing[ipv6]" class="form-control" placeholder="" v-model="region.resource_pricing.ipv6 || 0">
								<span class="input-group-addon">IPv6 /IP</span>
							</div>
						</div>
					</div>-->
					<br/>
					<div class="row">
						<div class="col-md-2"></div>
						<div class="col-md-3">
							<button class="btn btn-primary" type="submit" :disabled="processing">
								<i v-if="!processing" class="fa fa-edit" aria-hidden="true"></i>
								<i v-else class="fa fa-spin fa-spinner"></i>
								Update Region
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Update Region'
	},
	data() {
		return {
			processing: false,
			region: {
				name: '',
				country: 'US',
				hidden: 0,
				locked: 0,
				resource_pricing: {
					cpu: 0.00,
					disk: 0.00,
					ipv4: 0.00,
					ram: 0.00,
					ipv6: 0.00
				},
				hypervisors: []
			},
			is_locked: false,
			is_hidden: false,
			hypervisors: []
		}
	},
	methods: {
		update() {
			this.$set(this, "processing", true);
			this.$axios.patch('/admin/regions/' + this.region.id, $('form').serialize()).then((response) => {
				this.$set(this, "processing", false);
			}).catch((error) => {
				this.$set(this, "processing", false);
			})
		}
	},
	async asyncData({$axios, route}) {
		let existing = [], selected_hypervisors = [];

		let region_response = await $axios.get('/admin/regions/' + route.params.id);
		if (region_response) {
			region_response.data.hypervisors.forEach((hypervisor) => {
				existing.push(hypervisor.id);
				selected_hypervisors.push({
					id: hypervisor.id,
					text: hypervisor.name + '-' + hypervisor.ip,
					selected: true
				});
			});
		}

		return {
			existing: existing,
			selected_hypervisors: selected_hypervisors,
			region: region_response.data
		}
	},
	mounted() {
		let vm = this;
		$('[name="country"]').select2({
			placeholder: "Select Country",
			data: this.$store.state.global.countryList
		}).on('change', function () {
			vm.$set(vm.region, "country", this.value);
		}).val(this.region.country).trigger('change');

		$('[name="hypervisor_id[]"]').select2({
			placeholder: 'Select Hypervisors',
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
						hypervisors.push({id: hypervisor.id, text: hypervisor.name + '-' + hypervisor.ip});
					});
					return {
						results: hypervisors
					}
				},
				cache: true
			},
			data: vm.selected_hypervisors
		});
	}
}
</script>
