<template>
	<div class="dashcontent">
		<h1 style="font-size: 14pt;"><i class="fas fa-server" aria-hidden="true"></i> Create Subuser</h1>
		<div class="dashstuff">
			<div class="tab-content">
				<div role="tabpanel" class="wow fadeIn reseller tab-pane active">
					<form @submit.prevent="create">
						<h4>New User Details - ( {{ user_limit }} )</h4>
						<hr>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.first_name}">
									<label> First Name</label>
									<input type="text" name="first_name" class="form-control input-lg">
									<span class="help-block" v-if="errors.first_name">{{ errors.first_name[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.last_name}">
									<label> Last Name</label>
									<input type="text" name="last_name" class="form-control input-lg">
									<span class="help-block" v-if="errors.last_name">{{ errors.last_name[0] }}</span>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.email}">
									<label> Email</label>
									<input type="email" name="email" class="form-control input-lg">
									<span class="help-block" v-if="errors.email">{{ errors.email[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group"
								<div class="form-group" :class="{'has-error': errors.password}">
									<label> Password</label>
									<input type="password" name="password" class="form-control input-lg">
									<span class="help-block" v-if="errors.password">{{ errors.password[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6 firewall-manage">
								<br>
								<button type="submit" class="btn btn-primary normal" :class="{disabled: processing}" :disabled="processing">
									<span v-if="processing"><i class="fa fa-spin fa-spinner"></i> Creating</span>
									<span v-else><i class="fa fa-plus"></i> Create </span>
								</button>
							</div>
						</div>

					</form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'user',
	head: {
		title: 'Create Instance',
	},
	validate({store, redirect}) {
		if (store.state.auth.user.is_reseller !== 1) {
			return redirect('/user/dashboard');
		}
		return true;
	},
	data() {
		return {
			reseller_limits: {},
			processing: false,
			user_id: ''
		}
	},
	async asyncData({$axios}) {
		let limits = await $axios.get('/user/reseller/resources');
		return {
			reseller_limits: limits.data.reseller_limits
		}
	},
	methods: {
		create() {
			this.processing = true;
			this.$axios.post('/user/reseller/subusers', $('form').serialize()).then(() => {
				this.processing = false;
				setTimeout(() => {
					this.$router.push({name: 'user-subusers'});
				}, 2000);
			}).catch(() => {
				this.processing = false;
			});
		}
	},
	mounted() {

	},
	computed: {
		user_limit() {
			return this.reseller_limits.user_count === -1 ? 'Unlimited' : this.reseller_limits.user_count + ' left';
		}
	}
}
</script>
