<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-server" aria-hidden="true"></i> Create a hypervisor</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="create">
					<div class="row">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="col-md-3">
							<div class="form-group" :class="{'has-error': errors.name}">
								<input type="text" name="name" class="form-control" placeholder="Server Name">
								<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>IP:</h5>
						</div>
						<div class="col-md-3">
							<div class="form-group" :class="{'has-error': errors.ip}">
								<input type="text" name="ip" class="form-control" placeholder="IP">
								<span class="help-block" v-if="errors.ip">{{ errors.ip[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Private IP:</h5>
						</div>
						<div class="col-md-3">
							<div class="form-group" :class="{'has-error': errors.private_ip}">
								<input type="text" name="private_ip" class="form-control" placeholder="Private IP">
								<span class="help-block" v-if="errors.private_ip">{{ errors.private_ip[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>SSH Port:</h5>
						</div>
						<div class="col-md-3">
							<div class="form-group" :class="{'has-error': errors.ssh_port}">
								<input type="number" name="ssh_port" class="form-control" placeholder="Default is 22">
								<span class="help-block" v-if="errors.ssh_port">{{ errors.ssh_port[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>API Key::</h5>
						</div>
						<div class="col-md-3">
							<div class="form-group" :class="{'has-error': errors.key}">
								<input type="text" name="key" class="form-control" placeholder="API Key">
								<span class="help-block" v-if="errors.key">{{ errors.key[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>API Pass:</h5>
						</div>
						<div class="col-md-3">
							<div class="form-group" :class="{'has-error': errors.pass}">
								<input type="text" name="pass" class="form-control" placeholder="API Password">
								<span class="help-block" v-if="errors.pass">{{ errors.pass[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">

						</div>
						<button class="btn btn-primary" :disabled="processing">
							<i class="fa fa-spin fa-spinner" v-if="processing"></i>
							<i class="fa fa-plus" aria-hidden="true" v-else></i>
							Add Hypervisor
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
		title: 'Add Hypervisor'
	},
	data() {
		return {
			processing: false,
		}
	},
	methods: {
		create() {
			this.$set(this, "processing", true);
			this.$axios.post('/admin/hypervisors', $('form').serialize()).then((response) => {
				this.$set(this, "processing", false);
				this.$router.push({name: 'admin-hypervisor-id', params: {id: response.data.hypervisor.id}});
			}).catch((error) => {
				this.$set(this, "processing", false);
			});
		}
	},
	mounted() {
	}
}
</script>
