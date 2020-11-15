<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-server" aria-hidden="true"></i> Edit Hypervisor</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="update">
					<div class="row">
						<div class="col-md-3">
							<h5>Name:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.name}">
							<input type="text" name="name" class="form-control" v-model="hypervisor.name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>Domain:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.domain}">
							<input type="text" name="domain" class="form-control" placeholder="slave.hypervisor.io"
								   v-model="hypervisor.domain">
							<span class="help-block" v-if="errors.domain">{{ errors.domain[0] }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-md-3">
							<h5>IP:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.ip}">
							<input type="text" name="ip" class="form-control" v-model="hypervisor.ip">
							<span class="help-block" v-if="errors.ip">{{ errors.ip[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>Private IP:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.private_ip}">
							<input type="text" name="private_ip" class="form-control" v-model="hypervisor.private_ip">
							<span class="help-block" v-if="errors.private_ip">{{ errors.private_ip[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>noVNC Private:</h5>
						</div>
						<div class="col-md-3">
							<input type="hidden" name="vnc_private" value="0">
							<input type="checkbox" id="vnc_private" name="vnc_private" value="1"
								   :checked="hypervisor.vnc_private === 1"/>
							<label class="switchy" for="vnc_private"></label>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>HTTP API Port:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.http_api_port}">
							<input type="number" name="http_api_port" class="form-control"
								   v-model="hypervisor.http_api_port">
							<span class="help-block" v-if="errors.http_api_port">{{ errors.http_api_port[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>SSL API Port:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.ssl_api_port}">
							<input type="text" name="ssl_api_port" class="form-control"
								   v-model="hypervisor.ssl_api_port">
							<span class="help-block" v-if="errors.ssl_api_port">{{ errors.ssl_api_port[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>API Key:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.key}">
							<input type="text" name="key" class="form-control" v-model="hypervisor.key">
							<span class="help-block" v-if="errors.key">{{ errors.key[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>API Pass:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.pass}">
							<input type="text" name="pass" class="form-control" v-model="hypervisor.pass">
							<span class="help-block" v-if="errors.pass">{{ errors.pass[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>SSH Port:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.ssh_port}">
							<input type="number" name="ssh_port" class="form-control" v-model="hypervisor.ssh_port">
							<span class="help-block" v-if="errors.ssh_port">{{ errors.ssh_port[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>Default NIC:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.interface}">
							<input type="text" name="interface" class="form-control" v-model="hypervisor.interface">
							<span class="help-block" v-if="errors.interface">{{ errors.interface[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>Default Bridge (not required):</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.bridge}">
							<input type="text" name="bridge" class="form-control" v-model="hypervisor.bridge">
							<span class="help-block" v-if="errors.bridge">{{ errors.bridge[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>Bandwidth:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.bandwidth}">
							<div class="input-group">
								<input type="number" name="bandwidth" class="form-control"
									   v-model="hypervisor.bandwidth">
								<div class="input-group-addon">GB</div>
							</div>
							<span class="help-block" v-if="errors.bandwidth">{{ errors.bandwidth[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>Overcommit RAM:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.overcommit_ram}">
							<div class="input-group">
								<input type="number" class="form-control" name="overcommit_ram" value="0"
									   v-model="hypervisor.overcommit_ram">
								<div class="input-group-addon">MB</div>
							</div>
							<span class="help-block" v-if="errors.overcommit_ram">{{ errors.overcommit_ram[0] }}</span>
						</div>
					</div>
					<!--<div class="row">
						<div class="col-md-3">
							<h5>SSH Key:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.ssh_key}">
							<textarea class="form-control" name="ssh_key" cols="30" rows="10" v-model="hypervisor.ssh_key"></textarea>
							<span class="help-block" v-if="errors.ssh_key">{{ errors.ssh_key[0] }}</span>
						</div>
					</div>-->
					<div class="row">
						<div class="col-md-3">
							<h5>Manual Lock:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.manually_locked}">
							<input type="hidden" name="manually_locked" value="0">
							<input type="checkbox" name="manually_locked" id="manual_lock" value="1"
								   :checked="hypervisor.manually_locked === 1"/>
							<label class="switchy" for="manual_lock"></label>
							<span class="help-block" v-if="errors.manually_locked">{{
									errors.manually_locked[0]
								}}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<h5>Silence:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.silent}">
							<input type="hidden" name="silent" value="0">
							<input type="checkbox" name="silent" id="silence" value="1"
								   :checked="hypervisor.silent === 1"/>
							<label class="switchy" for="silence"></label>
							<span class="help-block" v-if="errors.silent">{{ errors.silent[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2"></div>
						<button class="btn btn-primary" type="submit" :disabled="processing">
							<i v-if="!processing" class="fa fa-edit" aria-hidden="true"></i>
							<i v-else class="fa fa-spin fa-spinner"></i>
							Update Hypervisor
						</button>
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
		title: 'Edit Hypervisor'
	},
	data() {
		return {
			is_locked: false,
			do_silence: false,
			is_vnc_private: false,
			hypervisor: {}
		}
	},
	validate() {
		return true;
	},
	asyncData({route, $axios, redirect}) {
		return $axios.get('/admin/hypervisors/' + route.params.id).then((response) => {
			return {
				processing: false,
				hypervisor: response.data
			}
		}).catch((error) => {
			redirect('/admin/hypervisors');
		})
	},
	methods: {
		update() {
			this.$axios.patch('/admin/hypervisors/' + this.hypervisor.id, $('form').serialize()).then((response) => {

			});
		}
	},
	mounted() {

	}
}
</script>
