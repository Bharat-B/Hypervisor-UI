<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-globe" aria-hidden="true"></i> Generate IPv4</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="create">
					<div class="row">
						<div class="col-md-2">
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
					<input type="hidden" name="version" value="v4">
					<div class="row">
						<div class="col-md-2">
							<h5>Generate:</h5>
						</div>
						<div class="col-md-3">
							<select name="ip_type" class="form-control" v-model="ip_type">
								<option value="single">Individual</option>
								<option value="range">Range</option>
							</select>
						</div>
					</div>
					<span v-if="ip_type === 'range'">
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
					<span v-else>
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
                                    <input type="text" class="form-control" name="mac[]"
										   placeholder="00:16:3e:59:8b:f8">
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
						<div class="col-md-2"></div>
						<div class="col-md-3">
							<button class="btn btn-primary" type="submit" :disabled="processing">
								<i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
								<i v-else class="fa fa-spin fa-spinner"></i>
								Generate
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
		title: 'Generate IPv4'
	},
	components: {
		singleip
	},
	data() {
		return {
			processing: false,
			netmask: 0,
			network: {},
			network_list: [],
			version: 'v6_subnet',
			singleipcount: [],
			ipcount: 0,
			ip_type: 'single'
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

		addIP() {
			this.ipcount++;
			this.singleipcount.push(this.ipcount);
		},
		removeipfield(i) {
			$('#ip-' + i).remove();
			this.singleipcount.splice(this.singleipcount.indexOf(i), 1);
		},
	},
	async asyncData({$axios}) {
		let network_list = [];
		let networks = await $axios.get('/admin/networks');
		if (networks) {
			networks.data.data.forEach((network) => {
				if (network.version === 'v4') {
					network_list.push({id: network.id, text: network.name, network: network});
				}
			});
			if (networks.data.last_page !== 1) {
				for (let i = 2; i <= networks.data.last_page; i++) {
					let pagination_response = await $axios.get('/admin/networks', {params: {page: i}});
					pagination_response.data.data.forEach((network) => {
						if (network.version === 'v4') {
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

		});

		$('[name="ip_type"]').select2({
			placeholder: "Select"
		}).on('change', function () {
			vm.$set(vm, "ip_type", this.value);
		});
	}
}
</script>
