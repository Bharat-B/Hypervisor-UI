<template>

</template>
<script>
export default {
	layout: 'guest',
	asyncData() {
		this.$router.push({name: 'login'});
	}
}
</script>
