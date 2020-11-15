<template>
    <div>
        <alert v-if="alerts.has" :type="alerts.type === 'success' ? 'info' : 'danger'" :position="alerts.position" :message="alerts.message"></alert>
        <leftnav></leftnav>
        <nuxt />
        <!-- Copyright -->
        <div class="footer">
            <p> 2020 © <a href="https://hypervisor.io">Hypervisor.io</a></p>
        </div>
    </div>
</template>
<script>
    import leftnav from '~/components/partials/admin/leftnav.vue'
    import alert from '~/components/alert.vue'

    export default {
        middleware: ['auth','admin'],
        components: {
            leftnav,
            alert
        },
        head(){
            return {
                bodyAttrs: {
                    id: 'switch'
                },
                script: [
                    { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js' },
                    { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/codemirror.min.js' },
                    { src: 'https://lovasoa.github.io/tidy-html5/tidy.js'},
					{ src: '/js/select2.js' },
                    { src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js' },
                    { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/mode/htmlmixed/htmlmixed.min.js' },
                    { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/addon/selection/active-line.min.js' },
                    { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/addon/edit/matchbrackets.min.js' },
                    { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/addon/edit/matchtags.min.js' },
                    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pace/1.0.2/pace.min.js' },
                    { src: 'https://cdnjs.cloudflare.com/ajax/libs/accounting.js/0.4.1/accounting.min.js'},
                    { src: 'https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.4.0/bootbox.min.js'},
					{ src: '/admin/js/custom.js' },
					{ src: '/admin/js/bootstrap.js' }
                ],
                link: [
                    { rel: 'stylesheet', href: '/admin/css/global.css' },
                    { rel: 'stylesheet', href: '/admin/css/animate.css' },
					{ rel: 'stylesheet', href: '/admin/css/custom.css' },
                    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/codemirror.min.css'},
                    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/theme/dracula.min.css'},
                    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.10/css/select2.min.css'},
                    { rel: 'stylesheet', href: '/css/flags.css'}
                ]
            };
        },
        mounted() {

            let body = $('body');
            body.tooltip({
                selector: '[data-toggle="tooltip"]',
                trigger: 'hover'
            });
            body.on("click", function(){
                $('[data-toggle="tooltip"]').tooltip('hide');
            });
            $(document).on('click','[data-toggle="tooltip"]',function(){
                $('[data-toggle="tooltip"]').tooltip('hide');
            });
        }
    }
</script>
