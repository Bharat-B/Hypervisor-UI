<template>
	<div class="logins">
		<div id="particles-js"></div>
		<img class="authlogo" :src="environment.settings.company_logo"/>
		<div class="animated fadeIn auth">
			<div class="authcon">
				<h3> Provide MFA Token </h3>
				<form class="form-signin" @submit.prevent="authenticate">
					<div class="form-group">
						<input type="text" class="form-control input-lg" name="token" required="" autofocus=""/>
					</div>
					<br>
					<button class="btn btn-lg btn-primary btn-block" :class="{'disabled': processing}" type="submit"
							:disabled="processing">
						<i class="fas" :class="{'fa-sign-in-alt': !processing, 'fa-spinner fa-spin': processing}"
						   aria-hidden="true"></i>&nbsp;
						<span v-if="processing && !dashboard">Checking</span>
						<span v-else-if="processing && dashboard">Preparing Dashboard</span>
						<span v-else>Verify Token</span>
					</button>
					<br/>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	middleware: 'auth',
	layout: 'default',
	data() {
		return {
			processing: false,
			dashboard: false,
		}
	},
	head: {
		title: 'Two Factor Authentication',
		script: [
			{src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js'},
			{src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js'},
			{src: '/js/bootstrap.js'},
			{src: '/js/custom.js'},

		],
		link: [
			{
				rel: 'stylesheet',
				href: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
			},
			{rel: 'stylesheet', href: '/css/global.css'},
			{rel: 'stylesheet', href: '/css/animate.css'},
		]
	},
	asyncData(context){
		if(context.store.getters.user.authenticated_mfa === 1){
			if(context.store.getters.user.role_id === 3){
				context.redirect('/user/dashboard');
			} else {
				context.redirect('/admin/dashboard');
			}
		}
	},
	methods: {
		async authenticate(refresh = true) {
			let vm = this;
			vm.$set(vm,'processing',true);
			let response = await vm.$axios.post('/auth/mfa', {
				token: $('[name="token"]').val(),
				admin_token: window.localStorage.getItem('auth.admin_token') || false
			}).catch((error) => {
				vm.$set(vm,'processing',false);
			});
			if( response ) {
				vm.$set(vm,'processing',false);
				if (response.data.user.authenticated_mfa === 1) {
					window.location.reload();
				}
			}
		}
	},
	mounted() {
		if(this.$store.getters.user.authenticated_mfa === 1){
			if(this.$store.getters.user.role_id === 1){
				this.$router.push({name: 'user-dashboard'});
			} else {
				this.$router.push({name: 'user-dashboard'});
			}
		}
		let admin_token = window.localStorage.getItem('auth.admin_token') || false;
		if (admin_token && this.$store.getters.user.role_id === 3 && this.$store.getters.user.mfa === 1 && this.$store.getters.user.authenticated_mfa !== 1) {
			this.authenticate(false);
		}
	},
}
</script>
