<template>
	<div class="logins">
		<div id="particles-js"></div>
		<img class="authlogo" :src="environment.settings.company_logo"/>
		<div class="animated fadeIn auth">
			<h3> Account Verification </h3>
			<div class="authcon">
				<div :class="{'alert alert-success': result.success, 'alert alert-danger': !result.success}">
					{{ result.message }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'default',
	head: {title: 'Account Verification'},
	data() {
		return {
			result: {}
		}
	},
	async asyncData({$axios, route}) {
		let token = route.params.id;
		return await $axios.get('/signup/verify/'+token).then((response) => {
			return { result: response.data }
		}).catch((error) => {
			return { result: {success: false, message: error} }
		});
	},
	mounted() {

	}
}
</script>
