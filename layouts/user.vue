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
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js' },
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js' },
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/pace/1.0.2/pace.min.js' },
                { src: 'https://cdn.jsdelivr.net/npm/apexcharts@latest'},
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/accounting.js/0.4.1/accounting.min.js'},
                { src: 'https://checkout.stripe.com/checkout.js'},
                { src: 'https://checkout.razorpay.com/v1/checkout.js'},
                { src: '/js/bootstrap.js' },
                { src: '/js/select2.js' },
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/codemirror.min.js' },
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/mode/shell/shell.min.js' },
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.4.0/bootbox.min.js'},
				{ src: '/js/custom.js'}
            ];
            return {
                script: scripts,
                link: [
                    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/codemirror.min.css'},
                    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/theme/dracula.min.css'},
                    { rel: 'stylesheet', href: '/css/global.css' },
                    { rel: 'stylesheet', href: '/css/animate.css' },
                    { rel: 'stylesheet', href: '/css/select2.min.css'},
                    { rel: 'stylesheet', href: '/css/flags.css'},
					{ rel: 'stylesheet', href: '/css/custom.css'}
                ]
            };
        },
        mounted() {

        }
    }
</script>
