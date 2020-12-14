<template>
    <form id="restore_snapshot">
        <div class="modal fade" id="restoreModal" role="dialog" :id="'snapshot-'+restoresnapshot.id">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" @click="close">&times;</button>
                        <h4 class="modal-title"><i class="fas fa-sync" aria-hidden="true"></i> Restore Snapshot {{ restoresnapshot.name }}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group" :class="{'has-error': errors.credit }">
							<select2 class="hpanel" v-bind:name="'instance_id'" v-bind:allowclear="'true'" v-once></select2>
                        </div>
                        <br />
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-default" type="submit" :disabled="processing" @click.prevent="do_restore">
                            <i v-if="!processing" class="fas fa-sync" aria-hidden="true"></i>
                            <i v-else class="fa fa-spin fa-spinner"></i>
                            Restore
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
<script>
	import select2 from "@/components/bootstrap/select2.vue";
    export default {
        props: ['restoresnapshot'],
		components: {
        	select2
		},
        data(){
            return {
                processing: false,
				instance_id: false
            }
        },
        methods: {
            close(){
                this.$emit('closeRestore')
            },
            do_restore(){
                let vm = this;
                vm.$set(this,'processing', true);
                if(vm.instance_id.length <= 0){
					vm.$set(this,'processing',false);
                	return;
				}

				vm.$axios.post('/user/snapshot/restore/'+vm.restoresnapshot.id+'/'+vm.instance_id).then((response) => {
					vm.close();
					vm.$router.push({name: 'user-instance-id', params: { id: vm.instance_id }, query: { tab: 'settings', subtab: 'tasks' }});
				}).catch((error) => {
					vm.close();
				});

                vm.$set(this,'processing',false);
            },
        },
        mounted(){
        	let vm = this;
			$('[name="instance_id"]').select2({
				placeholder: 'Select Instance',
				tags: true,
				ajax: {
					url: vm.$axios.defaults.baseURL + '/user/instances',
					headers: {
						"Authorization": window.localStorage.getItem('auth._token.local'),
						"X-Requested-With": 'XMLHttpRequest',
						"Content-Type": "application/json",
					},
					dataType: 'json',
					delay: 250,
					data: function (params) {
						return {
							search: $.trim(params.term),
						}
					},
					processResults: function (data) {
						let instances = [];
						data.data.forEach((instance) => {
							if (instance.hypervisor_id === vm.restoresnapshot.hypervisor_id) {
								instances.push({id: instance.id, text: [instance.hostname, instance.ips[0].ip ].join(' - ')});
							}
						});
						return {
							results: instances
						}
					},
					cache: true
				},
			}).on('change', function(){
				vm.$set(vm,"instance_id",this.value);
			});
        }
    }
</script>
