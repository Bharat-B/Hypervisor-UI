<template>
    <div class="dashcontent instance-s">
        <h1 style="font-size: 14pt;"><img :src="'/assets/'+instance.os_distro+'.png'" /> {{ instance.hostname }}</h1>
        <p><nuxt-link :to="{name: 'user-dashboard'}"><button class="btn btn-default"><i class="far fa-caret-square-left" aria-hidden="true"></i>&nbsp; All Instances</button></nuxt-link> </p>
        <div class="cpanel">
            <a href="#" @click.prevent="start('start')" :class="{'disabled': ( disableAction || instance.status && instance.status.status === 1 ) }"><i class="fa fa-play" aria-hidden="true"></i> <span>Start</span></a>
            <a href="#" @click.prevent="stop('stop')" :class="{'disabled': ( disableAction || instance.status && instance.status.status === 0 ) }" data-toggle="tooltip" data-placement="bottom" title="Stop this server"><i class="fa fa-stop" aria-hidden="true"></i> <span>Stop</span></a>
            <a href="#" @click.prevent="restart('restart')" :class="{'disabled': disableAction }" data-toggle="tooltip" data-placement="bottom" title="Restart this server"><i class="fas fa-redo" aria-hidden="true"></i> <span>Restart</span></a>
            <a href="#" @click.prevent="novnc" :class="{'disabled': ( disableAction || instance.status && instance.status.status === 0 ) }" data-toggle="tooltip" data-placement="bottom" title="Open console"><i class="fa fa-terminal" aria-hidden="true"></i> <span>Console</span></a>
            <a href="#" @click.prevent="destroy('destroy')" :class="{'disabled': disableAction }" data-toggle="tooltip" data-placement="bottom" title="Destroy" class="hide" v-if="enabledBilling || is_reseller === 1"><i class="fas fa-trash" aria-hidden="true"></i></a>
        </div>
        <div class="dashstuff">
            <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" :class="{'active': $route.query.tab === 'overview'}"><a href="#overview" @click.prevent="tab('overview')" aria-controls="overview" role="tab" data-toggle="tab"><i class="fas fa-tachometer-alt" aria-hidden="true"></i> Overview</a></li>
                <li role="presentation" :class="{'active': $route.query.tab === 'usage'}"><a href="#usage" @click.prevent="tab('usage')" aria-controls="usage" role="tab" data-toggle="tab"><i class="fas fa-chart-area" aria-hidden="true"></i> Usage Graphs</a></li>
                <li role="presentation" v-if="enabledBilling" :class="{'active': $route.query.tab === 'upgrade'}">
                    <a href="#upgrade" @click.prevent="tab('upgrade')" aria-controls="upgrade" role="tab" data-toggle="tab"><i class="fa fa-plus-square" aria-hidden="true"></i> Upgrade</a></li>
                <li class="last" role="presentation" :class="{'active': $route.query.tab === 'settings'}"><a href="#settings" @click.prevent="tab('settings')" aria-controls="settings" role="tab" data-toggle="tab"><i class="fas fa-sliders-h" aria-hidden="true"></i> Settings</a></li>
            </ul>
            <div class="tab-content">
                <div role="tabpanel" class="wow fadeIn tab-pane" :class="{'active': $route.query.tab === 'overview'}" id="overview">
                    <h3>Overview</h3>
                    <br />
                    <div class="charges" v-if="instance.enabled_billing === 1 && user.is_reseller !== 1 && !user.owner_id">
                        <p>Current Charges</p>
                        <b>{{ currentCharges }}</b>
                    </div>
                    <div class="row details">
                        <div class="col-md-6">
                            <p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>OS</b>:  {{ instance.os }}</p>
                            <p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>CPU</b>:  {{ instance.cpu_cores }} vCore(s) </p>
                            <p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>RAM</b>:  {{ instance.ram/1024 }} GB </p>
                            <p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Storage:</b>: {{ instance.disks[0].size }} GB SSD</p>
                            <p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Location</b>:  {{ instance.hypervisor.name }}, {{ instance.hypervisor.name }} </p>
                        </div>
                        <div class="col-md-6">
                            <p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>IPv4</b>:  {{ primary_ipv4 }}</p>
                            <p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>IPv6</b>:  {{ primary_ipv6 }}</p>
                            <p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>IPv6 Subnet</b>:  {{ primary_ipv6_subnet }}</p>
                            <p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Private IPv4</b>:  {{ private_ipv4 }}</p>
                            <p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Hypervisor</b>: {{ instance.hypervisor.name }}</p>
                            <p v-if="instance.plan_id !== '' && instance.plan_id !== '0'"><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Plan</b>:  {{ instance.plan.name }}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-6 stat">
                                    <b>Bandwidth Usage</b>
                                    <p class="less" v-if="instance.bandwidth !== 0">{{ instance.used_bandwidth }}GB of {{ instance.bandwidth }}GB</p>
                                    <div id="bandwidth2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div role="tabpanel" class="wow fadeIn tab-pane" :class="{'active': $route.query.tab === 'usage'}" id="usage">
                    <h3>Usage Graph</h3>
                    <br />
                    <select class="browser-default custom-select" v-model="statistics_period">
                        <option value="1h">Last Hour</option>
                        <option value="1w">This Week</option>
                        <option value="1mo">This Month</option>
                        <option value="1yr">This Year</option>
                    </select>
                    <br><br>
                    <div class="row">
                        <div class="col-md-6">
                            <h4>CPU Usage</h4>
                            <div id="cpu"></div>
                            <br>
                        </div>
                        <div class="col-md-6">
                            <h4>RAM Usage</h4>
                            <br>
                            <div id="ram"></div>
                        </div>
                    </div>
                </div>

                <div role="tabpanel" class="wow fadeIn tab-pane" :class="{'active': $route.query.tab === 'settings'}" id="settings">
                    <br />
                    <div class="row">
                        <div class="col-md-3">
                            <div class="smenu">
                                <h3><a @click.prevent="sidemenu"><i class="fa fa-bars" aria-hidden="true"></i> Settings</a></h3>
                                <ul class="animated fadeIn nav nav-tabs" id="sidemenu" role="tablist">
                                    <li role="presentation" :class="{'active': $route.query.subtab === 'boot'}"><a href="#boot" @click.prevent="tab('settings','boot')" aria-controls="home" role="tab" data-toggle="tab"><i class="fas fa-power-off" aria-hidden="true"></i> Boot &  Virtio</a></li>
                                    <li role="presentation" :class="{'active': $route.query.subtab === 'rescue'}"><a href="#rescue" @click.prevent="tab('settings','rescue')" aria-controls="rescue" role="tab" data-toggle="tab"><i class="fa fa-life-ring" aria-hidden="true"></i> Rescue</a></li>
                                    <li role="presentation" :class="{'active': $route.query.subtab === 'network'}"><a href="#network" @click.prevent="tab('settings','network')" aria-controls="home" role="tab" data-toggle="tab"><i class="fa fa-globe" aria-hidden="true"></i> Public Network</a></li>
                                    <li role="presentation" :class="{'active': $route.query.subtab === 'firewall'}"><a href="#firewall" @click.prevent="tab('settings','firewall')" aria-controls="messages" role="tab" data-toggle="tab"><i class="fa fa-ban" aria-hidden="true"></i> Firewall</a></li>
                                    <li role="presentation" :class="{'active': $route.query.subtab === 'custom-iso'}"><a href="#custom-iso" @click.prevent="tab('settings','custom-iso')" aria-controls="settings" role="tab" data-toggle="tab"><i class="fas fa-compact-disc" aria-hidden="true"></i> Custom ISO</a></li>
                                    <li role="presentation" :class="{'active': $route.query.subtab === 'hostname'}"><a href="#hostname" @click.prevent="tab('settings','hostname')" aria-controls="settings" role="tab" data-toggle="tab"><i class="fa fa-cog" aria-hidden="true"></i> Change Hostname</a></li>
                                    <li role="presentation" :class="{'active': $route.query.subtab === 'password'}"><a href="#password" @click.prevent="tab('settings','password')" aria-controls="settings" role="tab" data-toggle="tab"><i class="fas fa-key" aria-hidden="true"></i> Change Password</a></li>
                                    <li role="presentation" :class="{'active': $route.query.subtab === 'os'}"><a href="#os" @click.prevent="tab('settings','os')" aria-controls="settings" role="tab" data-toggle="tab"><i class="fab fa-linux" aria-hidden="true"></i> Change OS</a></li>
                                    <li role="presentation" :class="{'active': $route.query.subtab === 'vnc'}"><a href="#vnc" @click.prevent="tab('settings','vnc')" aria-controls="vnc" role="tab" data-toggle="tab"><i class="fa fa-terminal" aria-hidden="true"></i> VNC Details</a></li>
                                    <li role="presentation" :class="{'active': $route.query.subtab === 'tasks'}"><a href="#tasks" @click.prevent="tab('settings','tasks')" aria-controls="tasks" role="tab" data-toggle="tab"><i class="fas fa-tasks" aria-hidden="true"></i> Tasks</a></li>
                                </ul>

                            </div>
                        </div>
                        <div class="col-md-9">
                            <div class="tab-content">
                                <div role="tabpanel" class="tab-pane" :class="{'active in': $route.query.subtab === 'boot'}" id="boot">
                                    <h4><b>Boot & Virtio</b></h4>
                                    <br><br>
                                    <div class="row">
                                        <div class="col-md-5">
                                            <p><b>Boot Order</b>: </p>
                                            <br>
                                            <select class="js-example-basic-single form-control" name="boot" v-model="instance.boot" data-width="100%">
                                                <option value="cda">(1) CD Rom (2) Hard Disk</option>
                                                <option value="cdrom">CD Rom</option>
                                                <option value="hd">Hard Disk</option>
                                            </select>
                                            <br>
                                            <button class="btn btn-primary" role="button" type="button" @click.prevent="change_boot()" :disabled="disableAction">Save Changes</button>
                                        </div>
                                        <div class="col-md-5">
                                            <p><b>Disk Driver</b>:</p>
                                            <br>
                                            <select class="js-example-basic-single form-control" name="driver" v-model="disk_driver" data-width="100%">
                                                <option value="default">IDE</option>
                                                <option value="virtio">Virtio</option>
                                                <option value="scsi">SCSI</option>
                                            </select>
                                            <br>
                                            <button class="btn btn-primary" role="button" type="button" @click.prevent="change_driver()" :disabled="disableAction">Save Changes</button>
                                        </div>
                                    </div>
                                    <br>
                                    <p style="color: #969696;">* A reboot is required for changes to apply.</p>
                                </div>
                                <div role="tabpanel" class="tab-pane" :class="{'active in': $route.query.subtab === 'network'}" id="network">
                                    <h4><b>Public Network</b></h4>
                                    <br>
                                    <input type="search" class="form-control" placeholder="Search IPv4" v-model="public_ipv4_pagination.search" @keyup.enter="get_ips">
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                            <tr>
                                                <th>Address</th>
                                                <th>Netmask</th>
                                                <th>Gateway</th>
                                                <th>Version</th>
                                                <th>Type</th>
                                                <th>Action</th>
                                                <!--<th>Reverse DNS</th>-->
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="ip in public_ipv4_pagination.ips.data">
                                                <td>{{ ip.ip }}</td>
                                                <td>{{ ip.network.netmask }}</td>
                                                <td>{{ ip.network.gateway }}</td>
                                                <td>{{ ip.network.version }}</td>
                                                <td>{{ ip.network.type }}</td>
                                                <td>
                                                    <a :class="{disabled: ip.primary === 1}" href="#">
                                                        <button style="float: right;" class="btn btn-default"><i class="fa fa-trash" aria-hidden="true"></i></button>
                                                    </a>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="ipages">
                                        <div class="btn-group dropup">
                                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> {{ public_ipv4_pagination.per_page }} entries
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li :class="{active: public_ipv4_pagination.per_page === 20}"><a href="#" @click.prevent="$set($data.public_ipv4_pagination,'per_page',20)">20 entries</a></li>
                                                <li :class="{active: public_ipv4_pagination.per_page === 50}"><a href="#" @click.prevent="$set($data.public_ipv4_pagination,'per_page',50)">50 entries</a></li>
                                                <li :class="{active: public_ipv4_pagination.per_page === 100}"><a href="#" @click.prevent="$set($data.public_ipv4_pagination,'per_page',100)">100 entries</a></li>
                                            </ul>
                                        </div>
                                        <div class="btn-group dropup">
                                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Page {{ public_ipv4_pagination.ips.current_page }}
                                                <i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li v-for="i in $pageRange(public_ipv4_pagination.ips.last_page)">
                                                    <a href="#" @click.prevent="$set($data.public_ipv4_pagination,'page',i)">
                                                        {{ i }}
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" :class="{'active in': $route.query.subtab === 'firewall'}" id="firewall">
                                    <h4><b>Firewall</b></h4>
                                    <p>Select a firewall for your instance. </p>
                                    <br>
                                    <select class="form-control firewall-select2 select2-hidden-accessible" name="firewall_id" data-width="100%"></select>
                                    <br>
                                    <a href="#" @click="update_firewall()"><button class="btn btn-primary" :disabled="disableAction">Select</button></a>
                                    <br><br>
                                    <p style="text-decoration: underline;">
                                        <nuxt-link :to="{name: 'user-firewall-create'}" tag="a">Don't have one already?</nuxt-link>
                                    </p>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" :class="{'active in': $route.query.subtab === 'custom-iso'}" id="custom-iso">
                                    <h4><b>ISO Library</b></h4>
                                    <p>Choose from our library of ISO, make sure you backup everything before continuing.</p>
                                    <br>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>Primary ISO</label>
                                                <div class="controls">
                                                    <select class="js-example-basic-single form-control" name="iso_id" data-width="100%">

                                                    </select>
                                                </div>
                                            </div>
                                            <button class="btn btn-primary" @click.prevent="mount_piso" v-if="instance.iso_id === '' || instance.iso_id === 0" :disabled="disableAction">Mount</button>
                                            <button class="btn btn-primary" @click.prevent="umount_piso" v-else :disabled="disableAction">Unmount</button>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>Secondary ISO</label>
                                                <div class="controls">
                                                    <select class="js-example-basic-single form-control" name="secondary_iso_id" data-width="100%">

                                                    </select>
                                                </div>
                                            </div>
                                            <button class="btn btn-primary" @click.prevent="mount_siso" v-if="instance.secondary_iso_id === '' || instance.secondary_iso_id === 0" :disabled="disableAction">Mount</button>
                                            <button class="btn btn-primary" @click.prevent="umount_siso" v-else :disabled="disableAction">Unmount</button>
                                        </div>
                                    </div>
                                    <br><br>
                                    <p style="color: #969696;">* By installing an ISO, all the current data will be lost.</p>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" :class="{'active in': $route.query.subtab === 'hostname'}" id="hostname">
                                    <h4><b>Change Hostname</b></h4>
                                    <br>
                                    <input class="form-control add-reverse" style="height: 50px !important;; width: 40%; display: inline-block;" v-model="instance.hostname" name="hostname">
                                    <br>
                                    <button class="btn btn-primary" type="button" role="button" @click.prevent="change_hostname" :disabled="disableAction">Change Hostname</button>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" :class="{'active in': $route.query.subtab === 'password'}" id="password">
                                    <h4><b>Change Password</b></h4>
                                    <br>
                                    <input class="form-control add-reverse" type="password" style="height: 50px !important;; width: 40%; display: inline-block;" name="password">
                                    <br>
                                    <button class="btn btn-primary" type="button" role="button" @click.prevent="change_password" :disabled="disableAction">Change Password</button>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" :class="{'active in': $route.query.subtab === 'os'}" id="os">

                                    <h4><b>Change OS</b></h4>
                                    <p><b>Currently Installed</b>: {{ instance.os }}</p>
                                    <br>
                                    <select class="js-example-basic-single form-control" name="image_id" id="image_id" data-width="100%">
                                    </select>
                                    <br>
                                    <button class="btn btn-primary" type="button" role="button" @click.prevent="reinstall" :disabled="disableAction">Change OS</button>
                                    <br><br>
                                    <p style="color: #969696;">* Warning: Changing to a different operating system will wipe all the data on your server.</p>

                                </div>
                                <div role="tabpanel" class="tab-pane fade" :class="{'active in': $route.query.subtab === 'vnc'}" id="vnc">
                                    <h4><b>VNC Details</b></h4>
                                    <br><br>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <p><b>VNC IP</b>: </p>
                                            <input class="form-control" style="margin-top: 5px; width: 30%; display: inline-block; height: 51px; min-width: 190px;" v-model="instance.hypervisor.ip" readonly>
                                            <br>
                                            <p><b>VNC Port</b>: </p>
                                            <input class="form-control" style="margin-top: 5px; width: 30%; display: inline-block; height: 51px; min-width: 190px;" v-model="instance.vnc_port" readonly>
                                        </div>
                                        <div class="col-md-6">
                                            <p><b>VNC Password</b>: </p>
                                            <input class="form-control" style="width: 30%; display: inline-block; height: 51px; min-width: 190px;" placeholder="Password" name="vnc_password" v-model="instance.vnc_password">
                                            <br>
                                            <p style="margin-bottom: 15px;"><b>VNC Keymap</b>: </p>
                                            <select class="vnc_keymap form-control" name="vnc_keymap" data-width="100%" v-model="instance.vnc_keymap">
                                                <option value="en-us">en-us</option>
                                                <option value="de-ch">de-ch</option>
                                                <option value="ar">ar</option>
                                                <option value="da">da</option>
                                                <option value="et">et</option>
                                                <option value="fo">fo</option>
                                                <option value="fr-be">fr-be</option>
                                                <option value="fr-ch">fr-ch</option>
                                                <option value="hu">hu</option>
                                                <option value="it">it</option>
                                                <option value="lt">lt</option>
                                                <option value="mk">mk</option>
                                                <option value="nl">nl</option>
                                                <option value="no">no</option>
                                                <option value="pt">pt</option>
                                                <option value="ru">ru</option>
                                                <option value="sv">sv</option>
                                                <option value="tr">tr</option>
                                                <option value="de">de</option>
                                                <option value="en-gb">en-gb</option>
                                                <option value="es">es</option>
                                                <option value="fi">fi</option>
                                                <option value="fr">fr</option>
                                                <option value="fr-ca">fr-ca</option>
                                                <option value="hr">hr</option>
                                                <option value="is">is</option>
                                                <option value="ja">ja</option>
                                                <option value="lv">lv</option>
                                                <option value="nl-be">nl-be</option>
                                                <option value="pl">pl</option>
                                                <option value="pt-br">pt-br</option>
                                                <option value="sl">sl</option>
                                                <option value="th">th</option>
                                            </select>
                                        </div>
                                    </div>
                                    <a href="#"><button class="btn btn-primary" @clic.prevent="change_vncpasswd()" :disabled="disableAction">Save Changes</button></a>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" :class="{'active in': $route.query.subtab === 'tasks'}" id="tasks">
                                    <h4><b>Tasks</b></h4>
                                    <p class="less">Most Recent Tasks</p>
                                    <br>
                                    <span v-for="task in instance.tasks.slice(0, 5)">
                                        <p><b>Action</b>: {{ task.action }} | <B>Status</b>: {{ task.status }} </p>
                                        <div class="progress">
                                            <div class="progress-bar progress-bar-striped active" role="progressbar" :aria-valuenow="task.progress" aria-valuemin="0" aria-valuemax="100" :style="{width: task.progress+'%'}">
                                                <span class="sr-only">{{ task.progress }}% Complete</span>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                                <div role="tabpanel" class="wow fadeIn tab-pane" :class="{'active': $route.query.subtab === 'rescue'}" id="rescue">
                                    <h4><b>Enable Rescue Mode</b></h4>
                                    <p>Booting into Rescue Mode allows you to recover from kernel panic / errors and perform repairs on corrupted file systems.</p>
                                    <p>A complete Stop & Start is necessary for the instance to boot into Rescue Mode after being enabled.</p>

                                    <p v-if="instance.enabled_rescue !== 0">Password: {{ instance.rescue_password }}</p>

                                    <button class="btn btn-success" @click="enable_rescue" :disabled="disableAction" v-if="instance.enabled_rescue === 0">Enable Rescue Mode</button>
                                    <button class="btn btn-danger" @click="disable_rescue" :disabled="disableAction" v-else>Disable Rescue Mode</button>
                                    <br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import pagination from '~/components/pagination.vue'
    export default {
        layout: 'user',
        components: {
            pagination
        },
        watch : {
            'statistics_period': function(val){this.get_statistics();},
            'statistics': function(){
                let vm = this;
                if(this.statistics_rendered){

                    ApexCharts.exec('cpuchart', 'updateSeries', [{
                        data: vm.statistics.cpu
                    }], true);
                    ApexCharts.exec('cpuchart', 'updateOptions', {
                        labels: vm.statistics.labels,
                    }, false, true);

                    ApexCharts.exec('ramchart', 'updateSeries', [{
                        data: vm.statistics.ram
                    }], true);
                    ApexCharts.exec('ramchart', 'updateOptions', {
                        labels: vm.statistics.labels,
                    }, false, true);

                } else {
                    var options = {
                        chart: {
                            id: "",
                            type: "area",
                            height: 200,
                            foreColor: "#999",
                            toolbar: {
                                show: false
                            },
                            stacked: true,
                            dropShadow: {
                                enabled: true,
                                enabledSeries: [0],
                                top: -1,
                                left: 1,
                                blur: 4,
                                opacity: 0.06
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        colors: ['#3D3487', '#0090FF'],
                        stroke: {
                            curve: "smooth",
                            width: 4
                        },
                        series: [],
                        markers: {
                            size: 0,
                            strokeColor: "#fff",
                            strokeWidth: 3,
                            strokeOpacity: 1,
                            fillOpacity: 1,
                            hover: {
                                size: 6
                            }
                        },
                        xaxis: {
                            type: "datetime"
                        },
                        yaxis: {
                            labels: {
                                offsetX: 24,
                                offsetY: -5,
                                formatter: (value) => { return parseFloat(value,10).toFixed(2)+'%' },
                            },
                            tooltip: {
                                enabled: true
                            }
                        },
                        grid: {
                            padding: {
                                left: -5,
                                right: 5
                            }
                        },
                        legend: {
                            enabled: false,
                            position: 'top',
                            horizontalAlign: 'left'
                        },
                        fill: {
                            type: "solid",
                            fillOpacity: 0.7
                        },
                        labels: this.statistics.labels,
                    };

                    options.chart.id = "cpuchart";
                    options.series[0] = { name: "CPU", data: this.statistics.cpu };
                    var cpu_chart = new ApexCharts(document.querySelector("#cpu"), options);
                    cpu_chart.render();

                    options.chart.id = "ramchart";
                    options.series[0] = { name: "RAM",data: this.statistics.ram };
                    var ram_chart = new ApexCharts(document.querySelector("#ram"), options);
                    ram_chart.render();

                    this.$set(this,"statistics_rendered",true);
                }
            },
            'public_ipv4_pagination.page': function(val){
                this.get_ips();
            },
            'public_ipv4_pagination.per_page': function(val){
                this.get_ips();
            }

        },
        data(){
            return {
                instance: {},
                processing: false,
                noaction: false,
                running_task: false,
                disk_driver: 'virtio',
                noimages: true,
                noisos: true,
                bandwidth: {},
                statistics: {},
                statistics_period: '1h',
                statistics_rendered: false,
                polling: null,
                poll_tasks: [],
                public_ipv4_pagination: {
                    page: 1,
                    per_page: 15,
                    ips: {
                        data: []
                    },
                    search: ""
                }
            }
        },
        methods: {
            async get_instance(){
                /*await this.$axios.get('user/instances/'+this.$route.params.id).then((response)=>{
                    let primary_ipv4 = 'Not Assigned', primary_ipv6 = 'Not Assigned';
                    response.data.ips.forEach((ip)=>{
                        if(ip.primary === 1 && ip.type === 'public'){
                            if(ip.version === 'v4') {
                                primary_ipv4 = ip.ip
                            }
                            if(ip.version === 'v6') {
                                primary_ipv6 = ip.ip
                            }
                            if(ip.version === 'v6_subnet') {
                                primary_ipv6_subnet = ip.ip+'/'+ip.mask
                            }
                        }
                    });
                    this.$set(this,'instance', response.data);
                    this.$set(this,'primary_ipv4',primary_ipv4);
                    this.$set(this,'primary_ipv6',primary_ipv6);
                    this.$set(this,'primary_ipv6_subnet',primary_ipv6_subnet);primary_ipv6_subnet
                    this.$set(this,'disk_driver',response.data.disks[0].driver);
                    this.update_tasks();
                }).catch((error)=>{
                    
                });*/
            },
            range(to) {
                let arr = [];
                for(let i=1; i <= to; i++) {
                    arr.push(i);
                }
                return arr;
            },
            tab(tab, subtab = ''){
                if(tab === 'settings' && subtab === '') {
                    subtab = 'boot'
                }
                let tab_element = $('[href="#'+tab+'"]');
                let subtab_element = $('[href="#'+subtab+'"]');
                tab_element.click();
                subtab_element.click();
                this.$router.replace({path: '/user/instance/'+this.$route.params.id, query: {tab: tab, subtab: subtab}});
            },
            sidemenu() {
                var x = document.getElementById("sidemenu");
                if (x.style.display === "block") {
                    x.style.display = "none";
                } else {
                    x.style.display = "block";
                }
            },
            async get_images(){
                let response = await this.$axios.get('user/images').catch(()=>{});
                if(response){
                    let images = {}, imageselect = [];
                    response.data.data.forEach((image,k)=>{
                        if(!images[image.distro]){
                            images[image.distro] = [];
                        }
                        images[image.distro].push({id: image.id, text: image.name, selected: this.instance.image_id === image.id});
                    });
                    if(response.data.last_page !== 1){
                        for(let i=2;i<=response.data.last_page;i++){
                            let response = await this.$axios.get('user/images',{params: {page: i}}).catch(()=>{});
                            if(response){
                                response.data.data.forEach((image,k)=>{
                                    if(!images[image.distro]){
                                        images[image.distro] = [];
                                    }
                                    images[image.distro].push({id: image.id, text: image.name, selected: this.instance.image_id === image.id});
                                });
                            }
                        }
                    }
                    if(imageselect.length > 0){
                        imageselect = [];
                    }
                    $.each(images,(k,v)=>{
                        let group = k.substring(0,1).toUpperCase() + k.substring(1).toLowerCase();
                        imageselect.push({text: group, children: v});
                    });
                    if ($('[name="image_id"]').hasClass("select2-hidden-accessible")) {
                        $('[name="image_id"]').select2('destroy').empty();
                    }
                    $('[name="image_id"]').select2({placeholder: "Select Image", data: imageselect});
                    if(imageselect.length === 0){
                        this.$set(this,"noimages",true);
                    }
                }
            },
            async get_isos(){
                let vm = this;
                let response = await this.$axios.get('user/isos').catch(()=>{});
                if(response){
                    let isos = {}, isoselect = [];
                    response.data.data.forEach((iso,k)=>{
                        if(!isos[iso.distro]){
                            isos[iso.distro] = [];
                        }
                        isos[iso.distro].push({id: iso.id, text: iso.name});
                    });
                    if(response.data.last_page > 1){
                        for(let i=2;i<=response.data.data;i++){
                            let response = await this.$axios.get('user/isos',{params: {page: i}}).catch(()=>{});
                            if(response){
                                response.data.data.forEach((iso,k)=>{
                                    if(!isos[iso.distro]){
                                        isos[iso.distro] = [];
                                    }
                                    isos[iso.distro].push({id: iso.id, text: iso.name});
                                });
                            }
                        }
                    }

                    $.each(isos,(k,v)=>{
                        let group = k.substring(0,1).toUpperCase() + k.substring(1).toLowerCase();
                        isoselect.push({text: group, children: v});
                    });
                    if ($('[name="iso_id"]').hasClass("select2-hidden-accessible")) {
                        $('[name="iso_id"]').select2('destroy').empty();
                    }
                    if ($('[name="secondary_iso_id"]').hasClass("select2-hidden-accessible")) {
                        $('[name="secondary_iso_id"]').select2('destroy').empty();
                    }
                    $('[name="iso_id"]').select2({placeholder: "Select ISO", data: isoselect}).val(vm.instance.iso_id).trigger('change');
                    $('[name="secondary_iso_id"]').select2({placeholder: "Select ISO", data: isoselect}).val(vm.instance.secondary_iso_id).trigger('change');
                    if(isoselect.length === 0){
                        this.$set(this,"noisos",true);
                    }
                }
            },
            async get_ips(){
                let vm = this;
                let response = await this.$axios.get('user/instances/'+this.$route.params.id+'/ips',{
                    params: {
                        public_ipv4: vm.public_ipv4_pagination.page,
                        per_page: vm.public_ipv4_pagination.per_page,
                        search: vm.public_ipv4_pagination.search
                    }
                });
                console.log(response);
                if(response){
                    vm.$set(this.public_ipv4_pagination,"ips",response.data);
                }
            },
            start(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'start'
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });

            },
            stop(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'stop'
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            restart(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'restart'
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            destroy(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'destroy'
                }).then(() => {
                    this.$router.push({name: 'user-dashboard'});
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            change_boot(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'change_boot', boot: $('[name="boot"]').val()
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            change_driver(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'change_driver', driver: $('[name="driver"]').val()
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            update_firewall(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'update_firewall', firewall_id: $('[name="firewall_id"]').val()
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            change_password(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'change_password', password: $('[name="password"]').val()
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            change_hostname(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'change_hostname', hostname: $('[name="hostname"]').val()
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            change_nic(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'change_nic', nic_type: $('[name="nic_type"]').val()
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            change_vncpasswd(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'change_vncpasswd', vnc_password: $('[name="vnc_password"]').val()
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            change_vnckeymap(val){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'change_vnckeymap', vnc_keymap: val
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            mount_piso(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'mount_primaryiso', iso_id: $('[name="iso_id"]').val()
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            umount_piso(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                        action: 'unmount_primaryiso'
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            mount_siso(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                        action: 'mount_secondaryiso', secondary_iso_id: $('[name="secondary_iso_id"]').val()
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            umount_siso(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                        action: 'unmount_secondaryiso'
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            enable_rescue(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'enable_rescue'
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            disable_rescue(){
                this.$set(this,'processing',true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'disable_rescue'
                }).then(() => {
                    this.get_instance();
                    this.$set(this,'processing',false);
                }).catch((error)=>{
                    this.get_instance();
                    this.$set(this,'processing',false);
                });


            },
            async reinstall(){
                this.$set(this, "processing", true);
                this.$axios.post('user/instance/'+this.$route.params.id,{
                    action: 'reinstall',
                    image_id: $('[name="image_id"]').val()
                }).then(()=>{
                    this.$set(this, "processing", false);
                    vm.$options.asyncData(vm.$root.$options.context);
                }).catch((error)=>{
                    this.$set(this, "processing", false);
                });
            },
            async get_bandwidth(){
                let response = await this.$axios.get('user/instances/'+this.$route.params.id+'/bandwidth').catch(()=>{});
                this.$set(this,'bandwidth',response.data);
            },
            async get_statistics(){
                let response = await this.$axios.get('user/instances/'+this.$route.params.id+'/statistics',{ params: {period: this.statistics_period }}).catch(()=>{});
                this.$set(this,'statistics',response.data);
            },
            novnc(){
                this.$axios.get('user/instance/'+this.$route.params.id+'/novnc').then((response)=>{
                    var x=window.open('','', 'height=768px,width=1024px');
                    x.document.open();
                    x.document.write(response.data);
                    x.document.close();
                });
            },
            async update_tasks(){
                let vm = this;
                clearInterval(vm.polling);
                if(vm.instance.tasks.length >= 1){
                    vm.$set(this,"running_task", true);
                    vm.instance.tasks.forEach((task,k)=>{
                        if($.inArray(task.status,['done','failed']) === -1){
                            vm.poll_tasks.push(task.id);
                        }
                    });
                } else {
                    vm.$set(this,"running_task", false);
                }
                vm.polling = setInterval(()=>{
                    vm.$axios.get('user/tasks',{
                        params: {
                            tasks: vm.poll_tasks.join(',')
                        }
                    }).then((response)=>{
                        if (response.data.length >= 1) {
                            response.data.forEach((task) => {
                                vm.poll_tasks.forEach((tid) => {
                                    if (tid === task.id) {
                                        vm.instance.tasks.forEach((t, k) => {
                                            if(t.id === task.id){
                                                vm.$set(vm.instance.tasks,k,task);
                                            }
                                        });
                                        if(['done','failed'].indexOf(task.status) !== -1){
                                            vm.$set(this,"running_task", false);
                                            vm.poll_tasks.splice(vm.poll_tasks.indexOf(tid),1);
                                            this.get_instance();
                                        }
                                    }
                                });
                            });
                        }
                    }).catch((error)=>{
                        vm.$set(this,"running_task", false);
                    });
                    if (vm.poll_tasks.length <= 0) {
                        clearInterval(vm.polling);
                        vm.$set(this,"running_task", false);
                    }
                },5000);
            }
        },
        async  asyncData({ $axios, params, route, redirect, store }){
            let response = await $axios.get('/user/instances/'+params.id);
            if(response){
                console.log(response.data);
            }
            return {
                instance: response.data
            }
        },
        mounted(){
            let vm = this;
            $('[name="firewall_id"]').select2({
                placeholder: 'Select Firewall',
                ajax: {
                    url: vm.$axios.defaults.baseURL+'/user/firewalls',
                    headers: {
                        "Authorization" : window.localStorage.getItem('auth._token.local'),
                        "X-Requested-With": 'XMLHttpRequest',
                        "Content-Type" : "application/json",
                    },
                    dataType: 'json',
                    delay: 250,
                    data: function(params) {
                        return {
                            search: $.trim(params.term),
                        }
                    },
                    processResults: function (data) {
                        let firewalls = [];
                        data.data.forEach((firewall)=>{
                            firewalls.push({id: firewall.id, text: firewall.name , firewall: firewall, selected: vm.instance.firewall_id === firewall.id});
                        });
                        return {
                            results: firewalls
                        }
                    },
                    cache: true
                },
                data: vm.instance.firewall ? [{ id: vm.instance.firewall_id, text: vm.instance.firewall.name, selected: true }] : []
            });
            if(this.$route.query.tab){
                let tab = this.$route.query.tab;
                let subtab = this.$route.query.subtab;
                vm.tab(tab, subtab);
            } else {
                vm.tab('overview');
            }
            $('.js-example-basic-single').select2({});
            $('.vnc_keymap').select2().on('change', function(){
                vm.change_vnckeymap($(this).val());
            });
            this.get_images();
            this.get_isos();
            this.get_bandwidth();
            this.get_statistics();
            this.get_ips();
            var options = {
                chart: {type: 'radialBar', height: 200},
                plotOptions: {
                    radialBar: {
                        startAngle: -180,
                        endAngle: 180,
                        track: {
                            background: "#e7e7e7",
                            strokeWidth: '100%',
                            margin: 0,
                            shadow: {
                                enabled: true,
                                top: 1,
                                left: 0,
                                color: '#999',
                                opacity: 1,
                                blur: 1
                            }
                        },
                        dataLabels: {
                            name: {
                                show: false
                            },
                            value: {
                                offsetY: 11,
                                fontSize: '18px'
                            }
                        }
                    }
                },
                fill: {
                    colors: ['#3D3487', '#51489E', '#3D3487']
                },
                series: [ Math.round(this.instance.used_bandwidth*100/this.instance.bandwidth,2) ],
                labels: ['Bandwidth'],

            };
            var chart = new ApexCharts(
                document.querySelector("#bandwidth2"),
                options
            );
            chart.render();
            this.update_tasks();
        },
        computed: {
            currentCharges(){
                if(this.instance.charges) {
                    return this.$currencyFormat(parseFloat(this.instance.charges.charged) + parseFloat(this.instance.charges.tax_charged));
                } else {
                    return this.$currencyFormat(0.00);
                }
            },
            disableAction(){
                return ( this.noaction || this.processing || this.running_task || this.running_task && this.instance.created === 0 )
            },
            primary_ipv4(){
                let pip = "Not Assigned";
                this.instance.ips.forEach((ip) => {
                    if(ip.primary === 1 && ip.version === 'v4'){
                        pip = ip.ip
                    }
                });
                return pip;
            },
            primary_ipv6(){
                let pip = "Not Assigned";
                this.instance.ips.forEach((ip) => {
                    if(ip.primary === 1 && ip.version === 'v6' && ip.network.type === 'public'){
                        pip = ip.ip
                    }
                });
                return pip;
            },
            primary_ipv6_subnet(){
                let pip = "Not Assigned";
                this.instance.ips.forEach((ip) => {
                    if(ip.primary === 1 && ip.version === 'v6_subnet' && ip.network.type === 'public'){
                        pip = ip.ip
                    }
                });
                return pip;
            },
            private_ipv4(){
                let pip = "Not Assigned";
                this.instance.ips.forEach((ip) => {
                    if(ip.primary === 1 && ip.version === 'v4' && ip.network.type === 'private'){
                        pip = ip.ip
                    }
                });
                return pip;
            }
        }
    }

</script>
