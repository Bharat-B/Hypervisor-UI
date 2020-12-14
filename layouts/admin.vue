<template>
    <div>
        <alert v-if="alerts.has" :type="alerts.type === 'success' ? 'info' : 'danger'" :position="alerts.position" :message="alerts.message"></alert>
        <leftnav></leftnav>
        <nuxt />
		<div class="fixedbutton">
			<i class="far fa-comment-dots"></i>
		</div>
        <!-- Copyright -->
        <div class="footer">
            <p> 2020 © <a href="https://hypervisor.io">Hypervisor.io</a></p>
        </div>
    </div>
</template>
<style>
.fixedbutton {
	position: fixed;
	top: 40px;
	right: 10px;
	z-index: 11111;
	width: 38px;
	height: 38px;
	text-align: center;
	line-height: 40px;
	background: rgb(0, 0, 0, 0.6);
	color: #fff;
	cursor: pointer;
	border: 0;
	border-radius: 2px;
	text-decoration: none;
	transition: opacity 0.2s ease-out;
	opacity: 1;
	box-shadow: 0 3px 2px -2px rgba(0,0,0,0.2);
}
</style>
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
                    { src: 'https://cdn.jsdelivr.net/npm/tidy-html5@0.1.1/tidy.js'},
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
					{ src: '/admin/js/bootstrap.js' },
					{ src: 'https://cdn.nolt.io/widgets.js' }
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

			window.noltQueue=window.noltQueue||[];function nolt(){noltQueue.push(arguments)}

			nolt('init', {
				url: 'https://hypervisor.nolt.io',
				selector: '.fixedbutton'
			});
        }
    }
</script>
