<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-globe" aria-hidden="true"></i> Add Network</h2>
		<div class="col-md-10">
			<div class="box storage network">
				<form @submit.prevent="create">
					<div class="row">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.name}">
							<input type="text" name="name" class="form-control" placeholder="Name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Network Version:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.version}">
							<select name="version" id="version" class="form-control" v-model="form.version">
								<option value="v4">IPv4</option>
								<option value="v6">IPv6</option>
							</select>
							<span class="help-block" v-if="errors.version">{{ errors.version[0] }}</span>
						</div>
					</div>
					<div class="row" v-if="form.version === 'v4'">
						<div class="col-md-2">
							<h5>IP(s) Type:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.ip_type}">
							<select name="ip_type" class="form-control" v-model="ip_type">
								<option value="range">Range</option>
								<option value="single">Single IP(s)</option>
							</select>
							<span class="help-block" v-if="errors.ip_type">{{ errors.ip_type[0] }}</span>
						</div>
					</div>
					<span v-if="ip_type === 'range' && form.version === 'v4'">
                    <div class="row">
                        <div class="col-md-2">
                            <h5>First IP:</h5>
                        </div>
                        <div class="form-group col-md-3" :class="{'has-error': errors.first_ip}">
                            <input type="text" name="first_ip" class="form-control" placeholder="First IP">
                            <span class="help-block" v-if="errors.first_ip">{{ errors.first_ip[0] }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <h5>Last IP:</h5>
                        </div>
                        <div class="form-group col-md-3" :class="{'has-error': errors.last_ip}">
                            <input type="text" name="last_ip" class="form-control" placeholder="Last IP">
                            <span class="help-block" v-if="errors.last_ip">{{ errors.last_ip[0] }}</span>
                        </div>
                    </div>
                </span>
					<span v-if="ip_type === 'single' && form.version === 'v4'">
                    <div class="row">
                        <div class="col-md-2">
                            <h5>Individual IP</h5>
                        </div>
                        <div class="form-group col-md-3" :class="{'has-error': errors['ips.0']}">
                            <div class="input-group">
                                <div class="input-group-addon">IP</div>
                                <input type="text" class="form-control" name="ips[0]" placeholder="192.168.1.1">
                            </div>
                            <span class="help-block" v-if="errors['ips.0']">{{ errors['ips.0'][0] }}</span>
                        </div>
                        <div class="form-group col-md-3" :class="{'has-error': errors.mac}">
                            <div class="input-group">
                                <div class="input-group-addon">MAC</div>
                                <input type="text" class="form-control" name="mac[]" placeholder="00:16:3e:59:8b:f8">
                                <div class="input-group-addon" @click.prevent="addIP()">
                                    <button class="btn" type="button"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                            <span class="help-block" v-if="errors.mac">{{ errors.mac[0] }}</span>
                        </div>
                    </div>
                    <singleip v-for="($ip,$key) in singleipcount" v-bind:ipindex="$key+1" :key="'ip-'+$ip"
							  v-bind:id="'ip-'+$ip" v-bind:ip="$ip" v-on:removeip="removeipfield"></singleip>
                </span>
					<div class="row">
						<div class="col-md-2">
							<h5>Netmask <span v-show="form.version === 'v6'">(Routed Prefix) /</span>: </h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.netmask}">
							<input type="text" name="netmask" class="form-control" placeholder="Netmask"
								   v-model="form.netmask" :placeholder="form.version === 'v4' ? '255.255.255.0' : '48'">
							<span class="help-block" v-if="errors.netmask">{{ errors.netmask[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Gateway:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.gateway}">
							<input type="text" name="gateway" class="form-control" placeholder="Gateway"
								   v-model="form.gateway">
							<span class="help-block" v-if="errors.gateway">{{ errors.gateway[0] }}</span>
						</div>
					</div>
					<div class="row" v-if="form.version === 'v4'">
						<div class="col-md-2">
							<h5>Network Type:</h5>
						</div>
						<div class="col-md-3">
							<select id="network" name="network" class="form-control" v-model="form.network">
								<option value="default">Bridge</option>
								<option value="nat">NAT (Hetzner)</option>
								<option value="routed">Routed ( OVH )</option>
								<option value="vlan">vLAN</option>
							</select>
						</div>
					</div>
					<div class="row" v-if="form.network === 'vlan'">
						<div class="col-md-2">
							<h5>vLAN Interface</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="vlan" class="form-control" placeholder="vLAN Interface">
						</div>
					</div>
					<div class="row" v-if="form.version === 'v4'">
						<div class="col-md-2">
							<h5>Pool Type:</h5>
						</div>
						<div class="col-md-3">
							<select class="form-control" name="type" v-model="form.type">
								<option value="public">Public</option>
								<option value="private">Private</option>
							</select>
						</div>
					</div>
					<div class="row" v-if="form.type === 'private' && form.network === 'default'">
						<div class="col-md-2">
							<h5>Private Bridge</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="bridge" class="form-control"
								   placeholder="Private Bridge Interface">
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
							<input type="text" name="ns1" class="form-control" v-model="form.ns1">
							<span class="help-block" v-if="errors.ns1">{{ errors.ns1[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>DNS 2:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.ns2}">
							<input type="text" name="ns2" class="form-control" v-model="form.ns2">
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
								<i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
								<i v-else class="fa fa-spin fa-spinner"></i>
								Create Network
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
import singleip from '~/components/network/single-ip.vue'

export default {
	layout: 'admin',
	head: {
		title: 'Add Network'
	},
	components: {
		singleip
	},
	methods: {
		dns(server) {
			this.$set(this.form, "ns1", this.dns_servers[server][this.form.version].dns1);
			this.$set(this.form, "ns2", this.dns_servers[server][this.form.version].dns2);
		},
		create() {
			this.processing = true;
			this.$axios.post('admin/networks', $('form').serialize()).then((response) => {
				this.processing = false;
			}).catch((error) => {
				this.processing = false;
			})
		},
		addIP() {
			this.ipcount++;
			this.singleipcount.push(this.ipcount);
		},
		removeipfield(i) {
			$('#ip-' + i).remove();
			this.singleipcount.splice(this.singleipcount.indexOf(i), 1);
		},
	},
	data() {
		return {
			processing: false,
			singleipcount: [],
			ipcount: 0,
			form: {
				type: 'public',
				network: 'default',
				version: 'v4',
				hypervisors: [],
				ips: [],
				first_ip: '',
				last_ip: '',
				ns1: '',
				ns2: '',
				netmask: '',
				gateway: ''
			},
			ip_type: 'range',
			dns_servers: {
				cloudflare: {
					v4: {
						dns1: "1.1.1.1",
						dns2: "1.0.0.1"
					},
					v6: {
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
					}
				},
				hypervisors: []
			}
		}
	},
	async asyncData({$axios, route}) {
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
			}
		}).on('change', function () {
			vm.$set(vm.form, "hypervisors", this.value);
		})
	}
}
</script>
