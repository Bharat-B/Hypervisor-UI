<template>
    <tr>
        <td>
            <div class="form-group" :class="{'has-error': errors['rules.'+rule+'.type'] }">
                <select :name="'rules['+rule+'][type]'" class="form-control" v-model="firewall.rules[rule].type" data-width="100%">
                    <option value="ssh">SSH</option>
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                    <option value="mysql">MySQL</option>
                    <option value="all_tcp">All TCP</option>
                    <option value="all_udp">All UDP</option>
                    <option value="icmp">ICMP</option>
                    <option value="custom">Custom</option>
                </select>
                <span class="help-block" v-if="errors['rules.'+rule+'.type']">{{ errors["rules."+rule+".type"][0] }}</span>
            </div>
        </td>
        <td class="protocol">
            <div class="form-group" :class="{'has-error': errors['rules.'+rule+'.protocol'] }">
                <select data-width="100%" :name="'rules['+rule+'][protocol]'" :id="'protocol-'+rule" class="protocol-select form-control" v-model="firewall.rules[rule].protocol" :readyonly="firewall.rules[rule].type !== 'custom' && firewall.rules[rule].type !== '' && firewall.rules[rule].type === null">
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                    <option value="icmp" :disabled="firewall.rules[rule].type !== 'icmp'">ICMP</option>
                </select>
                <span class="help-block" v-if="errors['rules.'+rule+'.protocol']">{{ errors["rules."+rule+".protocol"][0] }}</span>
            </div>
        </td>
        <td>
            <div class="form-group" :class="{'has-error': errors['rules.'+rule+'.ports'] }">
                <input :name="'rules['+rule+'][ports]'" class="form-control nameit" placeholder="Port" type="text" v-model="firewall.rules[rule].ports" :readonly="firewall.rules[rule].type !== 'custom' && firewall.rules[rule].type !== ''" :style="firewall.rules[rule].type !== 'custom' && firewall.rules[rule].type !== '' ? 'pointer-events: none;' : ''">
                <span class="help-block" v-if="errors['rules.'+rule+'.ports']">{{ errors["rules."+rule+".ports"][0] }}</span>
            </div>
        </td>
        <td class="ip-select">
            <div class="form-group" :class="{'has-error': errors['rules.'+rule+'.ips.0'] }">
                <select :name="'rules['+rule+'][ips][]'" class="form-control" :id="'ips-'+rule" multiple="multiple" data-width="100%">
                </select>
                <span class="help-block" v-if="errors['rules.'+rule+'.ips.0']">{{ errors["rules."+rule+".ips.0"][0] }}</span>
            </div>
        </td>
        <td>
            <input class="form-control nameit" placeholder="Comment" :name="'rules['+rule+'][comment]'" v-model="firewall.rules[rule].comment">
        </td>
        <td>
            <a href="#" @click.prevent="removerulefield(rule)"><button class="btn btn-default"><i class="fa fa-trash" aria-hidden="true"></i></button></a>
        </td>
    </tr>
</template>
<script>
    export default {
        props: [
            'rule',
            'firewall',
            'prerule'
        ],
        methods: {
            selectType(){
                let types = {};
                let vm = this;
                let rules = {}, ports = {tcp: [], udp: []};
                types = {
                    ssh: {ports: "22", protocol: "tcp", ips: ['0.0.0.0', '::']},
                    http: {ports: "80", protocol: "tcp", ips: ['0.0.0.0', '::']},
                    https: {ports: "443", protocol: "tcp", ips: ['0.0.0.0', '::']},
                    mysql: {ports: "3306", protocol: "tcp", ips: ['0.0.0.0', '::']},
                    all_tcp: {ports: "1-65535", protocol: "tcp", ips: ['0.0.0.0', '::']},
                    all_udp: {ports: "1-65535", protocol: "udp", ips: ['0.0.0.0', '::']},
                    icmp: {ports: "0", protocol: "icmp", ips: ['0.0.0.0', '::']},
                    custom: {ports: "", protocol: "tcp", ips: ['0.0.0.0', '::']}
                };
                let iplist = $('#ips-'+vm.rule);
                $.each(types[vm.firewall.rules[vm.rule].type],(k,v)=>{
                    if(k === "ips"){
                        if(iplist.hasClass('select2-hidden-accessible')) {
                            $('#ips-'+vm.rule).select2('destroy');
                        }
                        iplist.select2({
                            tags: true,
                            tokenSeparators: [',', ' '],
                            placeholder: "Type IP(s) separated by comma"
                        }).on('change',()=>{
                            vm.$set(vm.firewall.rules[vm.rule],"ips",$('[name="rules['+vm.rule+'][ips]"]').val());
                        }).val(v).trigger('change');
                    }
                    if(k === "protocol"){
                        $('[name="rules['+vm.rule+'][protocol]"]').val(v).trigger('change');
                    }
                    vm.$set(vm.firewall.rules[vm.rule],k,v);
                });
                for(let i = 0; i < vm.firewall.rules.length; i++){
                    if(vm.firewall.rules[i].type !== 'custom'){
                        if(vm.firewall.rules[i].type in rules) {
                            vm.$set(vm.firewall.rules[i],'error_type',true);
                        } else {
                            vm.$set(vm.firewall.rules[i],'error_type',false);
                        }
                    }
                    if(vm.firewall.rules[i].type === 'custom'){
                        if(vm.firewall.rules[i].protocol === 'tcp'){
                            if($.inArray(vm.firewall.rules[i].ports, ports['tcp']) !== -1){
                                vm.$set(vm.firewall.rules[i],'error_port',true);
                            } else {
                                vm.$set(vm.firewall.rules[i],'error_port',false);
                            }
                        } else if(vm.firewall.rules[i].protocol === 'udp') {
                            if($.inArray(vm.firewall.rules[i].ports, ports['udp']) !== -1){
                                vm.$set(vm.firewall.rules[i],'error_port',true);
                            } else {
                                vm.$set(vm.firewall.rules[i],'error_port',false);
                            }
                        }
                        if(vm.firewall.rules[i].ports !== ""){
                            ports[vm.firewall.rules[i].protocol].push(vm.firewall.rules[i].ports);
                        }
                    }
                    rules[vm.firewall.rules[i].type] = true;
                }
            },
            removerulefield(i){
                this.$emit('removerule', i)
            }
        },
        mounted(){
            let vm = this, ips = [];
            $('#protocol-'+vm.rule).select2({
                placeholder: "Protocol"
            }).on('change',()=>{
                vm.$set(this.firewall.rules[this.rule],"protocol",$('[name="rules['+vm.rule+'][protocol]"]').val());
            }).trigger('change');
            $('[name="rules['+vm.rule+'][type]').select2({
                placeholder: "Type"
            }).on('change',()=>{
                vm.$set(this.firewall.rules[this.rule],"type",$('[name="rules['+vm.rule+'][type]"]').val());
                this.selectType();
            });
            $('[name="rules['+vm.rule+'][direction]').on('change',()=>{
                vm.$set(this.firewall.rules[this.rule],"direction",$('[name="rules['+vm.rule+'][direction]"]').val());
            });
            $('[name="rules['+vm.rule+'][action]').on('change',()=>{
                vm.$set(this.firewall.rules[this.rule],"action",$('[name="rules['+vm.rule+'][action]"]').val());
            });

            let iplist = $('#ips-'+vm.rule), all_ipv4 = false, all_ipv6 = false;

            $.each(vm.firewall.rules[vm.rule].ips,(k,ip)=>{
                if(['0.0.0.0','::'].indexOf(ip) === -1){
                    iplist.append(new Option(ip,ip,true,true));
                } else if(ip === '0.0.0.0'){
                    all_ipv4 = true;
                    iplist.append(new Option('All IPv4','0.0.0.0',true,true));
                } else {
                    all_ipv6 = true;
                    iplist.append(new Option('All IPv6','::',true,true));
                }
            });
            if(!all_ipv4){
                iplist.append(new Option('All IPv4','0.0.0.0',false,false));
            }
            if(!all_ipv6){
                iplist.append(new Option('All IPv6','::',false,false));
            }
            iplist.select2({
                tags: true,
                tokenSeparators: [',',' '],
                data: [],
                placeholder: "Type IP(s) seperated by comma(s)"
            }).on('change',()=>{
                vm.$set(this.firewall.rules[this.rule],"ips",$('[name="rules['+vm.rule+'][ips][]"]').val());
            });
        },
        created(){
            let vm = this;
            if(!this.prerule){
                vm.$set(this.firewall.rules,this.rule,{ports:'', protocol:'', ips:[]});
            } else {
                vm.$set(this.firewall.rules,this.rule,this.firewall.rules[this.rule]);
                vm.$set(this.firewall.rules[this.rule],"ports",this.firewall.rules[this.rule].startport+'-'+this.firewall.rules[this.rule].endport);
            }
        }
    }
</script>