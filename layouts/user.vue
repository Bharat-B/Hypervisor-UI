<template>
    <div>
        <alert v-if="alerts.has" :type="alerts.type === 'success' ? 'info' : 'danger'" :position="alerts.position" :message="alerts.message"></alert>
        <leftnav/>
        <nuxt/>
    </div>
</template>
<script>
    import leftnav from '~/components/partials/user/leftnav.vue'
    import alert from '~/components/alert.vue'

    export default {
        components: {
            leftnav,
            alert
        },
        middleware: ['auth','user'],
        head(){
            let scripts = [

                { src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js' },
                { src: 'https://cdn.jsdelivr.net/npm/apexcharts@latest'},
                { src: 'https://checkout.stripe.com/checkout.js'},
                { src: 'https://checkout.razorpay.com/v1/checkout.js'},
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/codemirror.min.js' },
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/mode/shell/shell.min.js' },

            ];
            return {
                script: scripts,
                link: [
                    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/codemirror.min.css'},
                    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/theme/dracula.min.css'},
                    { rel: 'stylesheet', href: '/css/global.css' },
                    { rel: 'stylesheet', href: '/css/animate.css' },
                    { rel: 'stylesheet', href: '/css/flags.css'},
					{ rel: 'stylesheet', href: '/css/custom.css'},
					{ rel: 'stylesheet', href: '/css/select2.min.css'},
                ]
            };
        },
        mounted() {

        }
    }
</script>
