<template>
	<div class="logins">
		<div id="particles-js"></div>
		<img class="authlogo" :src="environment.settings.company_logo"/>
		<div class="animated fadeIn auth">
			<div class="authcon">
				<h3> Client Area </h3>
				<form class="form-signin" @submit.prevent="login">
					<div class="form-group">
						<input v-model="form.email" type="email" class="form-control input-lg" name="email"
							   placeholder="Email Address" required="" autofocus=""/>
						<span class="help-block" v-if="errors.email">{{ errors.email[0] }}</span>
					</div>
					<div class="form-group">
						<input v-model="form.password" type="password" class="form-control input-lg" name="password"
							   placeholder="Password" required=""/>
						<span class="help-block" v-if="errors.password">{{ errors.password[0] }}</span>
					</div>
					<br/>
					<button class="btn btn-lg btn-primary btn-block" :class="{'disabled': processing}" type="submit"
							:disabled="processing">
						<i class="fas" :class="{'fa-sign-in-alt': !processing, 'fa-spinner fa-spin': processing}"
						   aria-hidden="true"></i>&nbsp;
						<span v-if="processing && !dashboard">Logging in</span>
						<span v-else-if="processing && dashboard">Preparing Dashboard</span>
						<span v-else>Secure Login</span>
					</button>
					<br/>
					<nuxt-link :to="{name: 'register'}" v-if="enabledBilling">Register Here</nuxt-link>
					<nuxt-link :to="{name: 'forgot-password'}" class="forgot">Forgot Password?</nuxt-link>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	middleware: 'guest',
	layout: 'default',
	head: {
		title: 'Login',
	},
	data() {
		return {
			form: {
				email: '',
				password: ''
			},
			dashboard: false,
			processing: false
		}
	},
	methods: {
		async login() {
			this.processing = true;
			try {
				await this.$auth.login({data: this.form});
			} catch (e) {
				this.processing = false;
				return;
			}
			this.dashboard = true;
			this.$nextTick(() => {
				this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : '/');
			});
		}
	},
	mounted() {
		new WOW().init();
	},
}
</script>
