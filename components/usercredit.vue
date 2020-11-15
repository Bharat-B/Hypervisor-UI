<template>
    <form id="user_credit">
        <div class="modal fade" id="creditModal" role="dialog" :id="'user-'+credituser.id">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" @click="close">&times;</button>
                        <h4 class="modal-title"><i class="far fa-money-bill-alt" aria-hidden="true"></i> Add User Credit {{ credituser.email }}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <h5>Credits: {{ currencySymbol[environment.settings.currency_code] }}{{ credituser.credit }} / Debits: {{ currencySymbol[environment.settings.currency_code] }}{{ credituser.debit }}</h5>
                        </div>
                        <div class="form-group" :class="{'has-error': errors.credit }">
                            <label class="sr-only">Amount</label>
                            <div class="input-group">
                                <div class="input-group-addon">{{ currencySymbol[environment.settings.currency_code] }}</div>
                                <input type="text" class="form-control" placeholder="Amount" name="amount">
                                <span class="help-block" v-if="errors.credit">{{ errors.credit[0] }}</span>
                            </div>
                        </div>
                        <br />
                        <div class="form-group" :class="{'has-error': errors.reason }">
                            <input type="text" name="reason" class="form-control" placeholder="Specify Reason">
                            <span class="help-block" v-if="errors.reason">{{ errors.reason[0] }}</span>
                        </div>

                        <br />
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-default" type="submit" :disabled="processing" @click.prevent="debit">
                            <i v-if="!processing" class="fa fa-minus" aria-hidden="true"></i>
                            <i v-else class="fa fa-spin fa-spinner"></i>
                            Remove Credit
                        </button>
                        <button class="btn btn-default" type="submit" :disabled="processing" @click.prevent="credit">
                            <i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
                            <i v-else class="fa fa-spin fa-spinner"></i>
                            Add Credit(s)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
<script>
    export default {
        props: ['credituser'],
        data(){
            return {
                processing: false,
                form: {
                    credit: 0.00,
                    reason: ''
                }
            }
        },
        methods: {
            close(){
                this.$emit('closeCredit')
            },
            credit(){
                let vm = this;
                vm.$set(this,'processing', true);
                vm.$axios.post('/admin/user/'+this.credituser.id+'/credit',$('form#user_credit').serialize()).then((response)=>{
                    if(response.data.success){
                        vm.close();
                    }
                    vm.$set(this, "processing", false);
                }).catch((error)=>{
                    vm.$set(this, "processing", false);
                });
            },
            debit(){
                let vm = this;
                vm.$set(this,'processing', true);
                vm.$axios.post('/admin/user/'+this.credituser.id+'/debit',$('form#user_credit').serialize()).then((response)=>{
                    if(response.data.success){
                        vm.close();
                    }
                    vm.$set(this, "processing", false);
                }).catch((error)=>{
                    vm.$set(this, "processing", false);
                });
            }
        },
        mounted(){

        }
    }
</script>