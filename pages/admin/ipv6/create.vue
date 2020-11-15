<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-globe" aria-hidden="true"></i> Generate IPv6</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="create">
					<div class="row">
						<div class="col-md-3">
							<h5>Generate:</h5>
						</div>
						<div class="col-md-3">
							<select name="version" class="form-control" v-model="version">
								<option value=""></option>
								<option value="v6_subnet">IPv6 Subnet(s)</option>
								<option value="v6">Individual IPv6</option>
							</select>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>Network:</h5>
						</div>
						<div class="col-md-3" :class="{'has-error': errors.network_id}" data-allow-clear="true"
							 data-width="100%">
							<select class="form-control" name="network_id">
								<option value=""></option>
							</select>
							<span class="help-block" v-if="errors.network_id">{{ errors.network_id[0] }}</span>
						</div>
					</div>
					<span v-show="version === 'v6_subnet'">
                        <div class="row">
                            <div class="col-md-3">
                                <h5>Source Netmask:</h5>
                            </div>
                            <div class="col-md-3">
                                <input type="hidden" class="form-control" name="source_netmask"
									   v-model="network.netmask">
                                <p>/{{ network.netmask }}</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-3">
                                <h5>Generate Netmask:</h5>
                            </div>
                            <div class="col-md-3" :class="{'has-error': errors.destination_netmask}">
                                <select class="form-control" name="destination_netmask" v-model="netmask">
                                    <option value=""></option>
                                    <option value="48">48</option>
                                    <option value="64">64</option>
                                    <option value="80">80</option>
                                    <option value="96">96</option>
                                    <option value="112">112</option>
                                </select>
                                <span class="help-block"
									  v-if="errors.destination_netmask">{{ errors.destination_netmask[0] }}</span>
                            </div>
                        </div>
                    </span>
					<div class="row">
						<div class="col-md-3">
							<h5>Sequence:</h5>
						</div>
						<div class="col-md-1" :class="{'has-error': errors['ipv6.1']}">
							<input type="text" class="form-control" maxlength="4" name="ipv6[1]">
							<span class="help-block" v-if="errors['ipv6.1']">{{ errors['ipv6.1'][0] }}</span>
						</div>
						<div class="col-md-1" :class="{'has-error': errors['ipv6.2']}">
							<input type="text" class="form-control" maxlength="4" name="ipv6[2]">
							<span class="help-block" v-if="errors['ipv6.2']">{{ errors['ipv6.2'][0] }}</span>
						</div>
						<div class="col-md-1" :class="{'has-error': errors['ipv6.3']}">
							<input type="text" class="form-control" maxlength="4" name="ipv6[3]">
							<span class="help-block" v-if="errors['ipv6.3']">{{ errors['ipv6.3'][0] }}</span>
						</div>
						<div class="col-md-1" :class="{'has-error': errors['ipv6.4']}">
							<input type="text" class="form-control" maxlength="4" name="ipv6[4]">
							<span class="help-block" v-if="errors['ipv6.4']">{{ errors['ipv6.4'][0] }}</span>
						</div>
						<div class="col-md-1" :class="{'has-error': errors['ipv6.5']}">
							<input type="text" class="form-control" maxlength="4" name="ipv6[5]">
							<span class="help-block" v-if="errors['ipv6.5']">{{ errors['ipv6.5'][0] }}</span>
						</div>
						<div class="col-md-1" :class="{'has-error': errors['ipv6.6']}">
							<input type="text" class="form-control" maxlength="4" name="ipv6[6]">
							<span class="help-block" v-if="errors['ipv6.6']">{{ errors['ipv6.6'][0] }}</span>
						</div>
						<div class="col-md-1" :class="{'has-error': errors['ipv6.7']}" v-if="version === 'v6_subnet'">
							<input type="text" class="form-control" maxlength="4" name="ipv6[7]">
							<span class="help-block" v-if="errors['ipv6.7']">{{ errors['ipv6.7'][0] }}</span>
						</div>
						<div class="col-md-1" :class="{'has-error': errors['ipv6.8']}" v-if="version === 'v6_subnet'">
							<input type="text" class="form-control" maxlength="4" name="ipv6[8]">
							<span class="help-block" v-if="errors['ipv6.8']">{{ errors['ipv6.8'][0] }}</span>
						</div>
						<div class="col-md-1" v-if="version === 'v6'">
							<h5>: auto</h5>
						</div>
						<div class="col-md-1" v-if="version === 'v6'">
							<h5>: auto</h5>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>Count:</h5>
						</div>
						<div class="col-md-3">
							<input type="number" name="ipv6_count" class="form-control">
						</div>
					</div>
					<div class="row">
						<div class="col-md-3"></div>
						<div class="col-md-3">
							<button class="btn btn-primary" type="submit"><i class="fa fa-plus" aria-hidden="true"></i>
								Create
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Generate IPv6'
	},
	watch: {
		'network': function (newval, oldval) {
			if (this.version === 'v6_subnet') {
				this.ipv6_disable();
				this.subnet_disable();
			} else {

			}
		},
		'version': function () {
			if (this.version === 'v6') {
				for (let i = 1; i <= 8; i++) {
					$('[name="ipv6[' + i + ']"]').prop('disabled', false);
				}
			}
		}
	},
	data() {
		return {
			processing: false,
			netmask: 0,
			network: {},
			network_list: [],
			version: 'v6_subnet'
		}
	},
	methods: {
		create() {
			this.processing = true;
			this.$axios.post('/admin/ips', $('form').serialize()).then(() => {
				this.processing = false;
			}).catch(() => {
				this.processing = false;
			});
		},
		ipv6_disable() {
			let netmask = parseInt(this.network.netmask);
			let bit = (netmask / 16);
			for (let i = 1; i <= 8; i++) {
				$('[name="ipv6[' + i + ']"]').prop('disabled', i >= (bit + 1));
			}
		},
		subnet_disable() {
			let vm = this;
			$('[name="destination_netmask"]').find('option').each((index, element) => {
				$('option[value="' + element.value + '"]').prop('disabled', false);
			});
			$('[name="destination_netmask"]').find('option').each((index, element) => {
				$('option[value="' + element.value + '"]').prop('disabled', parseInt(element.value) <= vm.network.netmask);
			});
		}
	},
	async asyncData({$axios}) {
		let network_list = [];
		let networks = await $axios.get('/admin/networks');
		if (networks) {
			networks.data.data.forEach((network) => {
				if (network.version === 'v6') {
					network_list.push({id: network.id, text: network.name, network: network});
				}

			});
			if (networks.data.last_page !== 1) {
				for (let i = 2; i <= networks.data.last_page; i++) {
					let pagination_response = await $axios.get('/admin/networks', {params: {page: i}});
					pagination_response.data.data.forEach((network) => {
						if (network.version === 'v6') {
							network_list.push({id: network.id, text: network.name, network: network});
						}
					});
				}
			}
			return {
				network_list: network_list
			}
		}
	},
	mounted() {
		let vm = this;

		$('[name="network_id"]').select2({
			placeholder: "Select Network",
			data: this.network_list,
			allowClear: true,
			tags: true
		}).on('select2:select', function (e) {
			vm.$set(vm, "network", e.params.data.network);
			$('[name="destination_netmask"]').val(null).trigger('change');
		}).on('select2:unselecting', () => {
			vm.$set(vm, "network", {});
			$('[name="destination_netmask"]').val(null).trigger('change');
		});
		$('[name="version"]').select2({placeholder: "Select"}).on('change', function () {
			vm.$set(vm, "version", this.value);
		});
		$('[name="destination_netmask"]').select2({
			placeholder: "Select Netmask", allowClear: true
		});
	}
}
</script>
