<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-globe" aria-hidden="true"></i> Update Network</h2>
		<div class="col-md-10">
			<div class="box storage network">
				<form @submit.prevent="update">
					<div class="row">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.name}">
							<input type="text" name="name" class="form-control" placeholder="Name"
								   v-model="network.name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Network Version:</h5>
						</div>
						<div class="col-md-3">
							<p>{{ network.version }}</p>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Netmask <span v-show="network.version === 'v6' || network.version === 'v6_subnet'">(Routed Prefix) /</span>:
							</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.netmask}">
							<input type="text" name="netmask" class="form-control" placeholder="Netmask"
								   v-model="network.netmask"
								   :placeholder="network.version === 'v4' ? '255.255.255.0' : '48'">
							<span class="help-block" v-if="errors.netmask">{{ errors.netmask[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Gateway:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.gateway}">
							<input type="text" name="gateway" class="form-control" placeholder="Gateway"
								   v-model="network.gateway">
							<span class="help-block" v-if="errors.gateway">{{ errors.gateway[0] }}</span>
						</div>
					</div>
					<div class="row" v-if="network.version === 'v4'">
						<div class="col-md-2">
							<h5>Network Type:</h5>
						</div>
						<div class="col-md-3">
							<h5>{{ $upperCase(network.network === 'default' ? 'Bridge' : network.network) }}</h5>
						</div>
					</div>
					<div class="row" v-if="network.network === 'vlan'">
						<div class="col-md-2">
							<h5>vLAN Interface</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="vlan" class="form-control" placeholder="vLAN Interface"
								   v-model="network.vlan">
						</div>
					</div>
					<div class="row" v-if="network.version === 'v4'">
						<div class="col-md-2">
							<h5>Pool Type:</h5>
						</div>
						<div class="col-md-3">
							<h5>{{ $upperCase(network.type) }}</h5>
						</div>
					</div>
					<div class="row" v-if="network.type === 'private' && network.network === 'bridge'">
						<div class="col-md-2">
							<h5>Private Bridge</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="bridge" class="form-control" placeholder="Private Bridge Interface"
								   v-model="network.bridge">
						</div>
					</div>
					<div class="row">
						<div class="col-md-2"></div>
						<div class="col-md-6">
							<button class="btn btn-primary" @click.prevent="dns('google')">Google</button>
							<button class="btn btn-primary" @click.prevent="dns('opendns')">OpenDNS</button>
							<button class="btn btn-primary" @click.prevent="dns('quad9')">Quad9</button>
							<button class="btn btn-primary" @click.prevent="dns('cloudflare')">Cloudflare</button>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>DNS 1:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.ns1}">
							<input type="text" name="ns1" class="form-control" v-model="network.ns1">
							<span class="help-block" v-if="errors.ns1">{{ errors.ns1[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>DNS 2:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.ns2}">
							<input type="text" name="ns2" class="form-control" v-model="network.ns2">
							<span class="help-block" v-if="errors.ns2">{{ errors.ns2[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Select Hypervisors:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.hypervisors}">
							<select name="hypervisors[]" class="form-control" multiple>
								<option value=""></option>
							</select>
							<span class="help-block" v-if="errors.hypervisors">{{ errors.hypervisors[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2"></div>
						<div class="col-md-3">
							<button class="btn btn-primary" type="submit" :disabled="processing">
								<i v-if="!processing" class="fa fa-edit" aria-hidden="true"></i>
								<i v-else class="fa fa-spin fa-spinner"></i>
								Update Network
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
		title: 'Update Network'
	},
	data() {
		return {
			processing: false,
			network: {},
			dns_servers: {
				cloudflare: {
					v4: {
						dns1: "1.1.1.1",
						dns2: "1.0.0.1"
					},
					v6: {
						dns1: "2606:4700:4700::1111",
						dns2: "2606:4700:4700::1001"
					},
					v6_subnet: {
						dns1: "2606:4700:4700::1111",
						dns2: "2606:4700:4700::1001"
					}

				},
				google: {
					v4: {
						dns1: "8.8.8.8",
						dns2: "8.8.4.4"
					},
					v6: {
						dns1: "2001:4860:4860::8888",
						dns2: "2001:4860:4860::8844"
					},
					v6_subnet: {
						dns1: "2001:4860:4860::8888",
						dns2: "2001:4860:4860::8844"
					}

				},
				opendns: {
					v4: {
						dns1: "208.67.222.222",
						dns2: "208.67.220.220"
					},
					v6: {
						dns1: "2620:0:ccc::2",
						dns2: "2620:0:ccd::2"
					},
					v6_subnet: {
						dns1: "2620:0:ccc::2",
						dns2: "2620:0:ccd::2"
					}

				},
				quad9: {
					v4: {
						dns1: "9.9.9.9",
						dns2: "149.112.112.112"
					},
					v6: {
						dns1: "2620:fe::fe",
						dns2: "2620:fe::9"
					},
					v6_subnet: {
						dns1: "2620:fe::fe",
						dns2: "2620:fe::9"
					}
				},
				hypervisors: []
			}
		}
	},
	methods: {
		update() {
			this.processing = true;
			this.$axios.patch('/admin/networks/' + this.network.id, $('form').serialize()).then((response) => {
				this.processing = false;
			}).catch((error) => {
				this.processing = false;
			});
		}
	},
	async asyncData({$axios, route}) {
		let existing = [], selected_hypervisors = [];

		let network_response = await $axios.get('/admin/networks/' + route.params.id);
		if (network_response) {
			network_response.data.hypervisors.forEach((hypervisor) => {
				existing.push(hypervisor.id);
				selected_hypervisors.push({
					id: hypervisor.id,
					text: hypervisor.name + '-' + hypervisor.ip,
					selected: true
				});
			})
		}

		return {
			existing: existing,
			selected_hypervisors: selected_hypervisors,
			network: network_response.data
		}
	},
	mounted() {
		let vm = this;
		$('[name="hypervisors[]"]').select2({
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
