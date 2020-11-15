<template>

</template>
<script>
export default {
	middleware: 'guest',
	mounted() {
		this.$router.push({name: 'login'})
	}
}
</script>
