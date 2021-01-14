<template>
    <div>
      <alert v-if="alerts.has && $route.name !== 'forgot-verify-id' && $route.name !== 'signup-verify-id'" :type="alerts.type === 'success' ? 'info' : 'danger'" :position="alerts.position" :message="alerts.message"></alert>
      <nuxt />
    </div>
</template>

<script>
  import alert from '~/components/alert.vue'
  export default {
    components: {
        alert
    },
    head: {
      script: [
		  {src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js'},
		  {src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js'},
		  {src: 'https://cdn.jsdelivr.net/npm/apexcharts@latest'},
		  {src: '/js/bootstrap.js'},
		  {src: '/js/custom.js'},
      ],
      link: [
        {rel: 'stylesheet', href: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'},
        {rel: 'stylesheet', href: '/css/global.css'},
        {rel: 'stylesheet', href: '/css/animate.css'},
      ]
    },
    mounted(){

    }
  }
</script>
