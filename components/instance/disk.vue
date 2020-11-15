<template>
    <div class="row" :id="'disk-'+disk">
        <div class="col-md-6">
            <select class="form-control" :name="'storages['+disk+']'" data-width="100%">
            </select>
        </div>
        <div class="col-md-6">
            <div class="input-group">
                <input type="text" :name="'disks['+disk+']'" class="form-control" v-if="!instance.disks || !instance.disks[disk]">
                <input type="text" :name="'disks['+instance.disks[disk].id+']'" class="form-control" v-model="instance.disks[disk].size" v-else>
                <div class="input-group-addon">GB</div>
                <div class="input-group-btn">
                    <button class="btn btn-default" type="button" @click.prevent="removeDisk(disk)"><i class="fa fa-minus" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['disk', 'instance', 'storages', 'disks'],
        methods: {
            removeDisk(i){
                this.$emit('removedisk', i);
            }
        },
        watch: {
            storages(val,old){
                let vm = this;
                let storage = $('[name="storages['+vm.disk+']"]');
                if(storage.hasClass('select2-hidden-accessible')){
                    storage.empty();
                }
                storage.select2({placeholder: "Select Storage", data: vm.storages });
            }
        },
        mounted(){
            let vm = this;
            if(vm.instance.disks && vm.disk.length >= 36 ){
                $('[name="storages['+vm.disk+']"]').select2({placeholder: "Select Storage", data: vm.storages }).val(vm.instance.disks[vm.disk].hypervisor_storage_id);
            } else {
                $('[name="storages['+vm.disk+']"]').select2({placeholder: "Select Storage", data: vm.storages });
            }

        }
    }
</script>
