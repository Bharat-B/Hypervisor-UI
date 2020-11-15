<template>
    <div class="row">
        <div class="col-md-2"></div>
        <div class="form-group col-md-3" :class="{'has-error': errors['ips.'+ipindex]}">
            <div class="input-group">
                <div class="input-group-addon">IP</div>
                <input type="text" class="form-control" :name="'ips['+ipindex+']'" placeholder="192.168.1.1">
            </div>
            <span class="help-block" v-if="errors['ips.'+ipindex]">{{ errors['ips.'+ipindex][0] }}</span>
        </div>
        <div class="form-group col-md-3">
            <div class="input-group">
                <div class="input-group-addon">MAC</div>
                <input type="text" class="form-control" name="mac[]" placeholder="00:16:3e:59:8b:f8">
                <div class="input-group-addon" @click.prevent="removeipfield(ip)">
                    <button class="btn" type="button"><i class="fas fa-minus"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['ip','ipindex'],
        methods: {
            removeipfield(i){
                this.$emit('removeip', i)
            }
        }
    }
</script>