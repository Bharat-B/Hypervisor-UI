<template>
	<div class="logins">
		<div id="particles-js"></div>
		<img class="authlogo" :src="environment.settings.company_logo"/>
		<div class="animated fadeIn auth">
			<h3> Forgot Password Verification </h3>
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
	head: {title: 'Forgot Password Verification'},
	data() {
		return {
			result: {},
			processing: false
		}
	},
	async asyncData({$axios, route}) {
		let token = route.params.id;
		return $axios.get('/forgot/verify/'+token).then((response) => {
			return { result: response.data }
		}).catch((error) => {
			console.log(JSON.stringify(error))
			return { result: {success: false, message: error} }
		});
	},
	mounted() {

	}
}
</script>
