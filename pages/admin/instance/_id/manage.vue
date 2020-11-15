<template>
	<div class="dashcontent instance-s">
		<h1 style="font-size: 14pt;"><img :alt="instance.os_name" :src="'/assets/'+instance.os_distro+'.png'"/>
			{{ instance.hostname }}</h1>
		<p>
			<nuxt-link :to="{name: 'admin-instances'}">
				<button class="btn btn-default"><i aria-hidden="true" class="far fa-caret-square-left"></i>&nbsp; All
					Instances
				</button>
			</nuxt-link>
		</p>
		<div class="cpanel">
			<a :class="{disabled:  disableAction || instance_running || instance_suspended || instance_network_suspended }" href="#"
			   @click.prevent="action('start')"><i
				aria-hidden="true" class="fa fa-play"></i> <span>Start</span></a>
			<a :class="{disabled:  disableAction || instance_stopped || instance_suspended || instance_network_suspended }" data-placement="bottom"
			   data-toggle="tooltip"
			   href="#" title="Stop this server" @click.prevent="action('stop')"><i aria-hidden="true"
																						 class="fa fa-stop"></i> <span>Stop</span></a>
			<a :class="{disabled: disableAction || instance_suspended || instance_network_suspended }" data-placement="bottom"
			   data-toggle="tooltip"
			   href="#" title="Restart this server" @click.prevent="action('restart')"><i aria-hidden="true"
																							class="fas fa-redo"></i>
				<span>Restart</span></a>
			<a :class="{disabled:  disableAction || instance_stopped }" data-placement="bottom" data-toggle="tooltip"
			   href="#" title="Open console" @click.prevent="novnc"><i aria-hidden="true"
																					 class="fa fa-terminal"></i> <span>Console</span></a>

			<a v-if="!instance_suspended" :class="{disabled: disableAction || instance_suspended }" data-placement="bottom"
			   data-toggle="tooltip" href="#" title="Suspend" @click.prevent="action('suspend')"><i
				aria-hidden="true" class="fas fa-pause"></i> <span>Suspend</span></a>
			<a v-if="instance_suspended" :class="{disabled: disableAction && !instance_suspended }" data-placement="bottom"
			   data-toggle="tooltip" href="#" title="Unsuspend" @click.prevent="action('resume')"><i
				aria-hidden="true" class="fas fa-play"></i> <span>Unsuspend</span></a>
			<a v-if="!instance_network_suspended" :class="{disabled: disableAction || instance_network_suspended }"
			   data-placement="bottom" data-toggle="tooltip"
			   href="#" title="Suspend" @click.prevent="action('suspend_network')"><i aria-hidden="true"
																				class="fas fa-wifi"></i> <span>Suspend Network</span></a>
			<a v-if="instance_network_suspended" :class="{disabled: disableAction || !instance_network_suspended }"
			   data-placement="bottom" data-toggle="tooltip"
			   href="#" title="Unsuspend Network" @click.prevent="action('resume_network')"><i aria-hidden="true"
																						  class="fas fa-wifi"></i> <span>Unsuspend Network</span></a>

			<a v-if="enabledBilling" :class="{disabled: disableAction || instance_suspended || instance_network_suspended }"
			   class="hide"
			   data-placement="bottom" data-toggle="tooltip" href="#" title="Destroy" @click.prevent="action('destroy')"><i
				aria-hidden="true" class="fas fa-trash"></i></a>
		</div>
		<div class="dashstuff">
			<ul class="nav nav-tabs" role="tablist">
				<li :class="{active: $route.query.tab === 'overview'}" role="presentation">
					<a aria-controls="overview" data-toggle="tab" href="#overview" role="tab"
					   @click.prevent="tab('overview')"><i aria-hidden="true" class="fas fa-tachometer-alt"></i> Overview</a>
				</li>
				<li :class="{active: $route.query.tab === 'settings'}" class="last" role="presentation">
					<a aria-controls="settings" data-toggle="tab" href="#settings" role="tab"
					   @click.prevent="tab('settings')"><i aria-hidden="true" class="fas fa-sliders-h"></i> Settings</a>
				</li>
			</ul>
			<div class="tab-content">
				<div id="overview" :class="{'active': $route.query.tab === 'overview'}" class="wow fadeIn tab-pane"
					 role="tabpanel">
					<h3>Overview</h3>
					<br/>
					<div v-if="enabledBilling" class="charges">
						<p>Current Charges</p>
						<b>{{ currentCharges }}</b>
					</div>
					<div class="row details">
						<div class="col-md-6">
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>Status</b>: {{ instance_status }}
							</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>OS</b>: {{ instance.os }}</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>CPU</b>: {{ instance.cpu_cores }}
								vCore(s) </p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>RAM</b>: {{
									$Mb2Gb(instance.ram)
								}} </p>
							<p v-if="instance.disks.length > 0"><i aria-hidden="true" class="far fa-dot-circle"></i> <b>Primary
								Storage:</b>: {{ $Gb2Tb(instance.disks[0].size) }} SSD</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>Location</b>:
								{{ instance_location }} </p>
						</div>
						<div class="col-md-6">
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>IPv4</b>: {{ primary_ipv4 }}</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>IPv6</b>: {{ primary_ipv6 }}</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>IPv6 Subnet</b>:
								{{ primary_ipv6_subnet }}</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>Private IPv4</b>: {{
									private_ipv4
								}}</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>Hypervisor</b>:
								{{ instance.hypervisor.name }}</p>
							<p v-if="instance.plan_id !== '' && instance.plan_id !== '0'"><i aria-hidden="true"
																							 class="far fa-dot-circle"></i> <b>Plan</b>:
								{{ instance.plan.name }}</p>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<b>Bandwidth Usage</b>
							<p v-if="instance.bandwidth !== 0" class="less">{{ instance.used_bandwidth }}GB of
								{{ instance.bandwidth }}GB</p>
							<div class="progress">
								<div :aria-valuenow="instance_used_bandwidth_percent" :style="{width: instance_used_bandwidth_percent+'%'}"
									 aria-valuemax="100" aria-valuemin="0"
									 class="progress-bar progress-bar-striped active" role="progressbar">
									{{ instance_used_bandwidth_percent }}%
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id="settings" :class="{'active': $route.query.tab === 'settings'}" class="wow fadeIn tab-pane"
					 role="tabpanel">
					<br/>
					<div class="row">
						<div class="col-md-3">
							<div class="smenu">
								<h3 style="cursor:pointer"><a @click.prevent="sidemenu"><i aria-hidden="true"
																						   class="fa fa-bars"></i>
									Settings</a></h3>
								<ul id="sidemenu" class="animated fadeIn nav nav-tabs" role="tablist">
									<li :class="{'active': $route.query.subtab === 'disk'}" role="presentation"><a
										aria-controls="home" data-toggle="tab" href="#disk"
										role="tab" @click.prevent="tab('settings','disk')"><i aria-hidden="true" class="fas fa-power-off"></i>
										Disk Settings</a></li>
									<li :class="{'active': $route.query.subtab === 'rescue'}" role="presentation"><a
										aria-controls="rescue" data-toggle="tab" href="#rescue"
										role="tab" @click.prevent="tab('settings','rescue')"><i aria-hidden="true" class="fa fa-life-ring"></i>
										Rescue</a></li>
									<li :class="{'active': $route.query.subtab === 'network'}" role="presentation"><a
										aria-controls="home" data-toggle="tab" href="#network"
										role="tab" @click.prevent="tab('settings','network')"><i aria-hidden="true" class="fa fa-globe"></i>
										Network</a></li>
									<li :class="{'active': $route.query.subtab === 'custom-iso'}" role="presentation"><a
										aria-controls="settings" data-toggle="tab"
										href="#custom-iso" role="tab" @click.prevent="tab('settings','custom-iso')"><i
										aria-hidden="true" class="fas fa-compact-disc"></i> Custom ISO</a></li>
									<li :class="{'active': $route.query.subtab === 'hostname'}" role="presentation"><a
										aria-controls="settings" data-toggle="tab"
										href="#hostname" role="tab" @click.prevent="tab('settings','hostname')"><i aria-hidden="true"
																								 class="fa fa-cog"></i>
										Change Hostname</a></li>
									<li :class="{'active': $route.query.subtab === 'password'}" role="presentation"><a
										aria-controls="settings" data-toggle="tab"
										href="#password" role="tab" @click.prevent="tab('settings','password')"><i aria-hidden="true"
																								 class="fas fa-key"></i>
										Change Password</a></li>
									<li :class="{'active': $route.query.subtab === 'os'}" role="presentation"><a
										aria-controls="settings" data-toggle="tab" href="#os"
										role="tab" @click.prevent="tab('settings','os')"><i aria-hidden="true" class="fab fa-linux"></i>
										Change OS</a></li>
									<li :class="{'active': $route.query.subtab === 'vnc'}" role="presentation"><a
										aria-controls="vnc" data-toggle="tab" href="#vnc"
										role="tab" @click.prevent="tab('settings','vnc')"><i aria-hidden="true" class="fa fa-terminal"></i>
										VNC Details</a></li>
									<li :class="{'active': $route.query.subtab === 'tasks'}" role="presentation"><a
										aria-controls="tasks" data-toggle="tab" href="#tasks"
										role="tab" @click.prevent="tab('settings','tasks')"><i aria-hidden="true" class="fas fa-tasks"></i>
										Tasks</a></li>
								</ul>

							</div>
						</div>
						<div class="col-md-9">
							<div class="tab-content">
								<div id="boot" :class="{'active in': $route.query.subtab === 'disk'}"
									 class="tab-pane" role="tabpanel">
									<h4><b>Disk Settings</b></h4>
									<br><br>
									<div class="row">
										<div class="col-md-5">
											<p><b>Boot Order</b>: </p>
											<br>
											<select v-model="instance.boot" class="js-example-basic-single form-control"
													data-width="100%" name="boot">
												<option value="cda">(1) CD Rom (2) Hard Disk</option>
												<option value="cdrom">CD Rom</option>
												<option value="hd">Hard Disk</option>
											</select>
											<br><br>
											<button :disabled="disableAction" class="btn btn-primary" role="button"
													type="button" @click.prevent="change_boot()">Save
												Changes
											</button>
										</div>
										<div class="col-md-5">
											<p><b>Disk Driver</b>:</p>
											<br>
											<select v-model="instance.disk_driver" class="js-example-basic-single form-control"
													data-width="100%" name="disk_driver">
												<option value="default">IDE</option>
												<option value="virtio">Virtio</option>
												<option value="scsi">SCSI</option>
											</select>
											<br><br>
											<button :disabled="disableAction" class="btn btn-primary" role="button"
													type="button" @click.prevent="change_driver()">Save
												Changes
											</button>
										</div>
									</div>
									<br>
									<p style="color: #969696;">* A reboot is required for changes to apply.</p>
								</div>
								<div id="network" :class="{'active in': $route.query.subtab === 'network'}"
									 class="tab-pane" role="tabpanel">
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

										<tr v-for="ip in instance.ips">
											<td>{{ ip.ip }}</td>
											<td>{{ ip.network.netmask }}</td>
											<td>{{ ip.network.gateway }}</td>
											<td>{{ ip.network.version }}</td>
											<td>{{ ip.network.type }}</td>
											<td>
												<a :class="{disabled: ip.primary === 1}" href="#">
													<button class="btn btn-default" style="float: right;"
															@click.prevent="change_primaryip(ip.id)"><i
														aria-hidden="true" class="fa fa-check"></i></button>
												</a>
											</td>
										</tr>
										</tbody>
									</table>
								</div>
								<div id="custom-iso" :class="{'active in': $route.query.subtab === 'custom-iso'}"
									 class="tab-pane fade" role="tabpanel">
									<h4><b>ISO Library</b></h4>
									<p>Choose from our library of ISO, make sure you backup everything before
										continuing.</p>
									<br>
									<div class="row">
										<div class="col-md-6">
											<div class="form-group">
												<label>Primary ISO</label>
												<div class="controls">
													<select2 v-once v-bind:allowClear="'true'" v-bind:data-width="'100%'"
															 v-bind:name="'iso_id'"></select2>
												</div>
											</div>
											<button v-if="instance.iso_id === '' || instance.iso_id === 0" :disabled="disableAction"
													class="btn btn-primary"
													@click.prevent="mount_piso">Mount
											</button>
											<button v-else :disabled="disableAction" class="btn btn-primary"
													@click.prevent="umount_piso">Unmount
											</button>
										</div>
										<div class="col-md-6">
											<div class="form-group">
												<label>Secondary ISO</label>
												<div class="controls">
													<select2 v-once v-bind:allowClear="'true'"
															 v-bind:data-width="'100%'"
															 v-bind:name="'secondary_iso_id'"></select2>
												</div>
											</div>
											<button v-if="instance.secondary_iso_id === '' || instance.secondary_iso_id === 0" :disabled="disableAction"
													class="btn btn-primary"
													@click.prevent="mount_siso">Mount
											</button>
											<button v-else :disabled="disableAction" class="btn btn-primary"
													@click.prevent="umount_siso">Unmount
											</button>
										</div>
									</div>
									<br><br>
									<p style="color: #969696;">* By installing an ISO, all the current data will be
										lost.</p>
								</div>
								<div id="hostname" :class="{'active in': $route.query.subtab === 'hostname'}"
									 class="tab-pane fade" role="tabpanel">
									<h4><b>Change Hostname</b></h4>
									<br>
									<input v-model="instance.hostname"
										   class="form-control add-reverse"
										   name="hostname" style="height: 50px !important;; width: 40%; display: inline-block;">
									<br>
									<button :disabled="disableAction" class="btn btn-primary" role="button"
											type="button" @click.prevent="change_hostname">Change Hostname
									</button>
								</div>
								<div id="password" :class="{'active in': $route.query.subtab === 'password'}"
									 class="tab-pane fade" role="tabpanel">
									<h4><b>Change Password</b></h4>
									<br>
									<input class="form-control add-reverse" name="password"
										   style="height: 50px !important;; width: 40%; display: inline-block;"
										   type="password">
									<br>
									<button :disabled="disableAction" class="btn btn-primary" role="button"
											type="button" @click.prevent="change_password">Change Password
									</button>
								</div>
								<div id="os" :class="{'active in': $route.query.subtab === 'os'}"
									 class="tab-pane fade" role="tabpanel">

									<h4><b>Change OS</b></h4>
									<p><b>Currently Installed</b>: {{ instance.os }}</p>
									<br>
									<select2 v-once v-bind:allowclear="'true'" v-bind:data-width="'100%'"
											 v-bind:name="'image_id'"></select2>
									<br><br>
									<button :disabled="disableAction" class="btn btn-primary" role="button"
											type="button" @click.prevent="reinstall">Change OS
									</button>
									<br><br>
									<p style="color: #969696;">* Warning: Changing to a different operating system will
										wipe all the data on your server.</p>

								</div>
								<div id="vnc" :class="{'active in': $route.query.subtab === 'vnc'}"
									 class="tab-pane fade" role="tabpanel">
									<h4><b>VNC Details</b></h4>
									<br><br>
									<div class="row">
										<div class="col-md-4">
											<p><b>VNC IP</b>: </p>
											<input v-model="instance.hypervisor.ip"
												   class="form-control"
												   readonly style="margin-top: 5px; width: 30%; display: inline-block; height: 51px; min-width: 190px;">
											<br>
											<p><b>VNC Port</b>: </p>
											<input v-model="instance.vnc_port"
												   class="form-control"
												   readonly style="margin-top: 5px; width: 30%; display: inline-block; height: 51px; min-width: 190px;">
										</div>
										<div class="col-md-6">
											<p><b>VNC Password</b>: </p>
											<input v-model="instance.vnc_password"
												   class="form-control"
												   name="vnc_password" placeholder="Password"
												   style="width: 30%; display: inline-block; height: 51px; min-width: 190px;">
											<br>
											<p style="margin-bottom: 15px;"><b>VNC Keymap</b>: </p>
											<select v-model="instance.vnc_keymap" class="vnc_keymap form-control" data-width="100%"
													name="vnc_keymap">
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
									<button :disabled="disableAction" class="btn btn-primary"
											@click.prevent="update()">Save Changes
									</button>
								</div>
								<div id="tasks" :class="{'active in': $route.query.subtab === 'tasks'}"
									 class="tab-pane fade" role="tabpanel">
									<h4><b>Tasks</b></h4>
									<p class="less">Most Recent Tasks</p>
									<br>
									<span v-for="task in instance.tasks.slice(0, 5)">
                                        <p><b>Action</b>: {{ task.action }} | <B>Status</b>: {{ task.status }} </p>
                                        <div class="progress">
                                            <div :aria-valuenow="task.progress" :style="{width: task.progress+'%'}"
												 aria-valuemax="100" aria-valuemin="0" class="progress-bar progress-bar-striped active"
												 role="progressbar">
                                                <span class="sr-only">{{ task.progress }}% Complete</span>
                                            </div>
                                        </div>
                                    </span>
								</div>
								<div id="rescue" :class="{'active': $route.query.subtab === 'rescue'}"
									 class="wow fadeIn tab-pane" role="tabpanel">
									<h4><b>Enable Rescue Mode</b></h4>
									<p>Booting into Rescue Mode allows you to recover from kernel panic / errors and
										perform repairs on corrupted file systems.</p>
									<p>A complete Stop & Start is necessary for the instance to boot into Rescue Mode
										after being enabled.</p>

									<p v-if="instance.enabled_rescue !== 0">Password: {{ instance.rescue_password }}</p>

									<button v-if="instance.enabled_rescue === 0" :disabled="disableAction || instance_suspended || instance_network_suspended"
											class="btn btn-success"
											@click.prevent="action('enable_rescue')">Enable Rescue Mode
									</button>
									<button v-else :disabled="disableAction || instance_suspended || instance_network_suspended"
											class="btn btn-danger"
											@click="action('disable_rescue')">Disable Rescue Mode
									</button>
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
import Select2 from '~/components/bootstrap/select2.vue'

export default {
	layout: 'admin',
	head: {
		title: 'Manage Instance'
	},
	components: {
		"select2": Select2
	},
	data() {
		return {
			instance: {},
			processing: false,
			noaction: false,
			running_task: false,
			disk_driver: 'virtio',
			noimages: true,
			noisos: true,
			polling: null,
			poll_tasks: [],
			tasks: {
				create_instance: 'Deploying',
				rebuild_instance: 'Re-Deploying',
				start_instance: 'Booting',
				stop_instance: 'Powering Off',
				shutdown_instance: 'Shutting Down',
				restart_instance: 'Rebooting',
				destroy_instance: 'Destroying',
				resume_instance: 'Resuming',
				suspend_instance: 'Suspending'
			},
			instance_statuses: {
				'1': 'Running',
				'0': 'Stopped',
				'2': 'Suspended',
				'5': 'Suspended'
			}
		}
	},
	methods: {
		tab(tab, subtab = '') {
			if (tab === 'settings' && subtab === '') {
				subtab = 'disk'
			}
			if (tab === 'settings') {
				if (this.$route.query.tab !== tab || this.$route.query.subtab !== subtab) {
					this.$router.replace({
						name: 'admin-instance-id-manage',
						params: {id: this.$route.params.id},
						query: {tab: tab, subtab: subtab}
					});
				}
			} else {
				if (this.$route.query.tab !== tab) {
					this.$router.replace({
						name: 'admin-instance-id-manage',
						params: {id: this.$route.params.id},
						query: {tab: tab}
					});
				}
			}
		},
		async get_instance() {
			await this.$axios.get('/admin/instances/' + this.$route.params.id).then((response) => {
				this.instance = response.data;
				this.update_tasks();
			}).catch((error) => {
				this.$router.push({name: 'admin-instances'});
			});
		},
		async get_images() {
			let response = await this.$axios.get('/admin/images').catch(() => {
			});
			if (response) {
				let images = {}, imageselect = [];
				response.data.data.forEach((image, k) => {
					if (!images[image.distro.display_name]) {
						images[image.distro.display_name] = [];
					}
					images[image.distro.display_name].push({
						id: image.id,
						text: image.name,
						selected: this.instance.image_id === image.id
					});
				});
				if (response.data.last_page !== 1) {
					for (let i = 2; i <= response.data.last_page; i++) {
						let response = await this.$axios.get('/admin/images', {params: {page: i}}).catch(() => {
						});
						if (response) {
							response.data.data.forEach((image, k) => {
								if (!images[image.distro.display_name]) {
									images[image.distro.display_name] = [];
								}
								images[image.distro.display_name].push({
									id: image.id,
									text: image.name,
									selected: this.instance.image_id === image.id
								});
							});
						}
					}
				}
				if (imageselect.length > 0) {
					imageselect = [];
				}
				$.each(images, (k, v) => {
					imageselect.push({text: k, children: v});
				});
				if ($('[name="image_id"]').hasClass("select2-hidden-accessible")) {
					$('[name="image_id"]').select2('destroy').empty();
				}
				$('[name="image_id"]').select2({placeholder: "Select Image", data: imageselect});
				if (imageselect.length === 0) {
					this.$set(this, "noimages", true);
				}
			}
		},

		async get_isos() {
			let vm = this;
			let response = await this.$axios.get('/admin/isos').catch(() => {
			});
			if (response) {
				let isos = {}, isoselect = [];
				response.data.data.forEach((iso, k) => {
					if (!isos[iso.distro.display_name]) {
						isos[iso.distro.display_name] = [];
					}
					isos[iso.distro.display_name].push({id: iso.id, text: iso.name});
				});
				if (response.data.last_page > 1) {
					for (let i = 2; i <= response.data.data; i++) {
						let response = await this.$axios.get('/admin/isos', {params: {page: i}}).catch(() => {
						});
						if (response) {
							response.data.data.forEach((iso, k) => {
								if (!isos[iso.distro.display_name]) {
									isos[iso.distro.display_name] = [];
								}
								isos[iso.distro.display_name].push({id: iso.id, text: iso.name});
							});
						}
					}
				}

				$.each(isos, (k, v) => {
					isoselect.push({text: k, children: v});
				});
				if ($('[name="iso_id"]').hasClass("select2-hidden-accessible")) {
					$('[name="iso_id"]').select2('destroy').empty();
				}
				if ($('[name="secondary_iso_id"]').hasClass("select2-hidden-accessible")) {
					$('[name="secondary_iso_id"]').select2('destroy').empty();
				}
				$('[name="iso_id"]').select2({
					placeholder: "Select ISO",
					data: isoselect
				}).val(vm.instance.iso_id).trigger('change');
				$('[name="secondary_iso_id"]').select2({
					placeholder: "Select ISO",
					data: isoselect
				}).val(vm.instance.secondary_iso_id).trigger('change');
				if (isoselect.length === 0) {
					this.$set(this, "noisos", true);
				}
			}
		},

		async action(action) {
			this.processing = true;
			await this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: action
			}).then(() => {
				this.get_instance();
			}).catch((error) => {
				this.processing = false;
			});
			this.processing = false;
		},

		change_boot() {
			this.$set(this, 'processing', true);
			this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: 'change_boot', boot: $('[name="boot"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},

		change_driver() {
			this.$set(this, 'processing', true);
			this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: 'change_driver', disk_driver: $('[name="disk_driver"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},

		change_password() {
			this.$set(this, 'processing', true);
			this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: 'change_password', password: $('[name="password"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},


		change_primaryip(ip) {
			this.$set(this, 'processing', true);
			this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: 'change_primaryip', ip: ip
			}).then(() => {
				this.$set(this, 'processing', false);
				this.get_instance();
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},

		change_hostname() {
			this.$set(this, 'processing', true);
			this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: 'change_hostname', hostname: $('[name="hostname"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},

		mount_piso() {
			this.$set(this, 'processing', true);
			this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: 'mount_primaryiso', iso_id: $('[name="iso_id"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});


		},

		umount_piso() {
			this.$set(this, 'processing', true);
			this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: 'unmount_primaryiso'
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});


		},

		mount_siso() {
			this.$set(this, 'processing', true);
			this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: 'mount_secondaryiso', secondary_iso_id: $('[name="secondary_iso_id"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},

		umount_siso() {
			this.$set(this, 'processing', true);
			this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: 'unmount_secondaryiso'
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},

		async reinstall() {
			let vm = this;
			this.$set(this, "processing", true);
			this.$axios.post('/admin/instance/' + this.$route.params.id, {
				action: 'reinstall',
				image_id: $('[name="image_id"]').val()
			}).then((response) => {
				this.$set(this, "processing", false);
				vm.nextTick(() => {
					vm.get_instance();
				})
			}).catch((error) => {
				this.$set(this, "processing", false);
			});
		},

		novnc() {
			this.$axios.get('/admin/instance/' + this.$route.params.id + '/novnc').then((response) => {
				var x = window.open('', '', 'height=768px,width=1024px');
				x.document.open();
				x.document.write(response.data);
				x.document.close();
			});
		},

		update() {
			this.$set(this, 'processing', true);
			this.$axios.patch('/admin/instance/' + this.$route.params.id, {
				vnc_password: $('[name="vnc_password"]').val(),
				vnc_keymap: $('[name="vnc_keymap"]').val()
			}).then((response) => {
				this.$set(this, 'processing', false);
			}).catch(() => {
				this.$set(this, 'processing', false);
			});
		},

		async update_tasks() {
			let vm = this;
			clearInterval(vm.polling);
			if (vm.instance.tasks && vm.instance.tasks.length >= 1) {
				vm.instance.tasks.forEach((task, k) => {
					if ($.inArray(task.status, ['done', 'failed']) === -1) {
						vm.$set(this, "running_task", true);
						vm.poll_tasks.push(task.id);
					}
				});
			} else {
				vm.$set(this, "running_task", false);
			}
			if (vm.running_task) {
				vm.tab('settings', 'tasks');
			}
			vm.polling = setInterval(() => {
				vm.$axios.get('/admin/tasks', {
					params: {
						tasks: vm.poll_tasks.join(',')
					}
				}).then((response) => {
					if (response.data.length >= 1) {
						response.data.forEach((task) => {
							vm.poll_tasks.forEach((tid) => {
								if (tid === task.id) {
									vm.instance.tasks.forEach((t, k) => {
										if (t.id === task.id) {
											vm.$set(vm.instance.tasks, k, task);
										}
									});
									if (['done', 'failed'].indexOf(task.status) !== -1) {
										vm.$set(this, "running_task", false);
										if (task.status === 'failed') {
											vm.poll_tasks.splice(vm.poll_tasks.indexOf(tid), 1);
											bootbox.alert({
												message: "Instance " + vm.instance.name + " - " + vm.tasks[task.action] + " " + task.status + "<br /><div class='col-md-12' style='overflow: scroll; height:200px;background-color: #000;'>" + task.message.toString().replace(/\n/g, "<br />") + "</div>",
												callback: function () {
													vm.get_instance();
												}
											});
										} else {
											vm.poll_tasks.splice(vm.poll_tasks.indexOf(tid), 1);
											vm.get_instance();
										}
									}
								}
							});
						});
					}
				}).catch((error) => {
					vm.$set(this, "running_task", false);
				});
				if (vm.poll_tasks.length <= 0) {
					clearInterval(vm.polling);
					vm.$set(this, "running_task", false);
				}
			}, 5000);
		},

		sidemenu() {
			var x = document.getElementById("sidemenu");
			if (x.style.display === "block") {
				x.style.display = "none";
			} else {
				x.style.display = "block";
			}
		}
	},
	async asyncData({$axios, params, route, redirect, store}) {
		let instance = await $axios.get('/admin/instances/' + params.id).catch(() => {
			redirect('/admin/instances');
		});
		return {
			instance: instance.data,
			disk_driver: instance.data.disk_driver
		}
	},
	mounted() {
		let vm = this;
		if (this.$route.query.tab) {
			let tab = this.$route.query.tab;
			let subtab = this.$route.query.subtab;
			vm.tab(tab, subtab);
		} else {
			vm.tab('overview');
		}
		$('.vnc_keymap').select2().on('change', function () {
			vm.change_vnckeymap($(this).val());
		});
		$('.js-example-basic-single').select2({});
		this.update_tasks();
		this.get_images();
		this.get_isos();
	},
	computed: {
		currentCharges() {
			if (this.instance.charges) {
				return this.$currencyFormat(parseFloat(this.instance.charges.charged) + parseFloat(this.instance.charges.tax_charged));
			} else {
				return this.$currencyFormat(0.00);
			}
		},
		disableAction() {
			return (this.noaction || this.processing || this.running_task || this.running_task && this.instance.created === 0)
		},
		primary_ipv4() {
			let pip = "Not Assigned";
			this.instance.ips.forEach((ip) => {
				if (ip.primary === 1 && ip.version === 'v4') {
					pip = ip.ip
				}
			});
			return pip;
		},
		primary_ipv6() {
			let pip = "Not Assigned";
			this.instance.ips.forEach((ip) => {
				if (ip.primary === 1 && ip.version === 'v6' && ip.network.type === 'public') {
					pip = ip.ip
				}
			});
			return pip;
		},
		primary_ipv6_subnet() {
			let pip = "Not Assigned";
			this.instance.ips.forEach((ip) => {
				if (ip.primary === 1 && ip.version === 'v6_subnet' && ip.network.type === 'public') {
					pip = ip.ip
				}
			});
			return pip;
		},
		private_ipv4() {
			let pip = "Not Assigned";
			this.instance.ips.forEach((ip) => {
				if (ip.primary === 1 && ip.version === 'v4' && ip.network.type === 'private') {
					pip = ip.ip
				}
			});
			return pip;
		},

		public_ipv4_list() {
			let ips = [];
			this.instance.ips.forEach((ip) => {
				if (ip.version === 'v4' && ip.network.type === 'public') {
					ips.push(ip.ip);
				}
			});
			return ips;
		},

		public_ipv6_list() {
			let ips = [];
			this.instance.ips.forEach((ip) => {
				if (ip.version === 'v6' && ip.network.type === 'public') {
					ips.push(ip.ip);
				}
			});
			return ips;
		},

		public_ipv6_subnet_list() {
			let ips = [];
			this.instance.ips.forEach((ip) => {
				if (ip.version === 'v6_subnet' && ip.network.type === 'public') {
					ips.push(ip.ip);
				}
			});
			return ips;
		},

		disk_size() {
			return (this.instance.disks && this.instance.disks.length > 0) ? this.instance.disks[0].size : 0
		},

		instance_running() {
			return this.instance.status && this.instance.status.status === 1;
		},

		instance_stopped() {
			return this.instance.status && this.instance.status.status === 0;
		},

		instance_suspended() {
			return this.instance.suspended === 1;
		},

		instance_network_suspended() {
			return this.instance.suspended_network === 1;
		},

		instance_location() {
			if (this.instance.hypervisor.region_id !== '') {
				if (this.instance.hypervisor.region.length !== 0) {
					return this.instance.hypervisor.region[0].name + ', ' + this.instance.hypervisor.region[0].country
				}
			}
			return 'N/A';
		},

		instance_used_bandwidth_percent() {
			return Math.round(this.instance.used_bandwidth * 100 / this.instance.bandwidth);
		},

		instance_status() {
			if (this.instance.suspended === 1) {
				return 'Suspended'
			} else if (this.instance.suspended_network === 1) {
				return 'Network Suspended'
			} else {
				return this.instance_statuses[this.instance.status.status];
			}
		}
	}
}
</script>
