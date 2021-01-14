<template>
	<div class="dashcontent instance-s">
		<p>
			<nuxt-link :to="{name: 'user-dashboard'}">
				<button class="btn btn-default"><i aria-hidden="true" class="far fa-caret-square-left"></i>&nbsp; All
					Instances
				</button>
			</nuxt-link>
		</p>
		<div class="cpanel">
			<a :class="{disabled:  disableAction || instance_running || instance_suspended || instance_network_suspended }" href="#" @click.prevent="action('start')">
				<i aria-hidden="true" class="fa fa-play"></i>
				<span>Start</span>
			</a>
			<a :class="{disabled:  disableAction || instance_stopped || instance_suspended || instance_network_suspended }" data-placement="bottom" data-toggle="tooltip" href="#" title="Stop this server" @click.prevent="action('stop')">
				<i aria-hidden="true" class="fa fa-stop"></i> <span>Stop</span>
			</a>
			<a :class="{disabled: disableAction || instance_suspended || instance_network_suspended }" data-placement="bottom" data-toggle="tooltip" href="#" title="Restart this server" @click.prevent="action('restart')">
				<i aria-hidden="true" class="fas fa-redo"></i> <span>Restart</span>
			</a>
			<a :class="{disabled:  disableAction || instance_stopped }" data-placement="bottom" data-toggle="tooltip" href="#" title="Open console" @click.prevent="novnc">
				<i aria-hidden="true" class="fa fa-terminal"></i> <span>Console</span>
			</a>
			<a v-if="!instance_suspended && is_reseller" :class="{disabled: disableAction || instance_suspended }" data-placement="bottom" data-toggle="tooltip" href="#" title="Suspend" @click.prevent="action('suspend')">
				<i aria-hidden="true" class="fas fa-pause"></i> <span>Suspend</span>
			</a>
			<a v-if="instance_suspended && is_reseller" :class="{disabled: disableAction && !instance_suspended }" data-placement="bottom" data-toggle="tooltip" href="#" title="Unsuspend" @click.prevent="action('resume')">
				<i aria-hidden="true" class="fas fa-play"></i> <span>Unsuspend</span>
			</a>
			<a v-if="!instance_network_suspended && is_reseller" :class="{disabled: disableAction || instance_network_suspended }" data-placement="bottom" data-toggle="tooltip" href="#" title="Suspend" @click.prevent="action('suspend_network')">
				<i aria-hidden="true" class="fas fa-wifi"></i> <span>Suspend Network</span>
			</a>
			<a v-if="instance_network_suspended && is_reseller" :class="{disabled: disableAction || !instance_network_suspended }" data-placement="bottom" data-toggle="tooltip" href="#" title="Unsuspend Network" @click.prevent="action('resume_network')">
				<i aria-hidden="true" class="fas fa-wifi"></i> <span>Unsuspend Network</span>
			</a>
			<a v-if="enabledBilling || is_reseller" :class="{disabled: disableAction || instance_suspended || instance_network_suspended }" class="hide" data-placement="bottom" data-toggle="tooltip" href="#" title="Destroy" @click.prevent="action('destroy')">
				<i aria-hidden="true" class="fas fa-trash"></i>
			</a>
		</div>
		<div class="dashstuff">
			<ul class="nav nav-tabs" role="tablist">
				<li :class="{active: $route.query.tab === 'overview'}" role="presentation">
					<a aria-controls="overview" data-toggle="tab" href="#overview" role="tab" @click.prevent="tab('overview')">
						<i aria-hidden="true" class="fas fa-tachometer-alt"></i> Overview
					</a>
				</li>
				<li v-if="enabledBilling && !is_reseller && !is_subuser && instance.plan_id !== '' && instance.plan_id !== 0 && instance.plan.upgrades.length > 0" :class="{active: $route.query.tab === 'upgrade'}" role="presentation">
					<a aria-controls="upgrade" data-toggle="tab" href="#upgrade" role="tab" @click.prevent="tab('upgrade')">
						<i aria-hidden="true" class="fa fa-plus-square"></i> Upgrade
					</a>
				</li>
				<li role="presentation" :class="{active: $route.query.tab === 'snapshots'}">
					<a href="#snapshots" aria-controls="snapshots" role="tab" data-toggle="tab" aria-expanded="false" @click.prevent="tab('snapshots')">
						<i class="fa fa-camera-retro" aria-hidden="true"></i> Snapshots
					</a>
				</li>
				<li :class="{active: $route.query.tab === 'settings', last: user.is_reseller === 0}" role="presentation">
					<a aria-controls="settings" data-toggle="tab" href="#settings" role="tab" @click.prevent="tab('settings')">
						<i aria-hidden="true" class="fas fa-sliders-h"></i> Settings
					</a>
				</li>
				<li v-if="is_reseller" :class="{'active': $route.query.tab === 'resources'}" class="last" role="presentation">
					<a aria-controls="resources" data-toggle="tab" href="#resources" role="tab" @click.prevent="tab('resources')">
						<i aria-hidden="true" class="fa fa-cog"></i> Resources
					</a>
				</li>
			</ul>
			<div class="tab-content">
				<div id="overview" :class="{'active': $route.query.tab === 'overview'}" class="wow fadeIn tab-pane" role="tabpanel">
					<h3 style="font-size: 14pt;"><img :alt="instance.os_name" :src="'/assets/'+instance.os_distro+'.png'"/>{{ instance.hostname }} - Overview</h3>
					<br/>
					<div v-if="enabledBilling && !is_reseller && !is_subuser" class="charges">
						<p>Current Charges</p>
						<b>{{ currentCharges }}</b>
					</div>
					<div class="row details">
						<div class="col-md-6">
							<p v-if="running_task">
								<label v-if="( instance.created === 0 || instance.created === 1 )">
									<i aria-hidden="true" class="far fa-dot-circle"></i> <b>Status</b>:
									<span v-for="task in instance.tasks" v-if="['done','failed'].indexOf(task.status) === -1" class="label label-info">
										<i class="fa fa-spin fa-spinner"></i> {{ tasks[task.action] }}
									</span>
								</label>
							</p>
							<p v-else-if="is_migrating">
								<i aria-hidden="true" class="far fa-dot-circle"></i> <b>Status</b>:
								<span class="label label-info">
									<i class="fa fa-spin fa-spinner"></i> Migrating
								</span>
							</p>
							<p v-else>
								<i aria-hidden="true" class="far fa-dot-circle"></i> <b>Status</b>: {{ instance_status }}
							</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>OS</b>: {{ instance.os }}</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>CPU</b>: {{ instance.cpu_cores }}
								vCore(s) </p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>RAM</b>: {{
									$Mb2Gb(instance.ram)
								}} </p>
							<p v-if="instance.disks.length > 0"><i aria-hidden="true" class="far fa-dot-circle"></i> <b>Storage:</b>:
								{{ $Gb2Tb(instance.disks[0].size) }} SSD</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>Location</b>: {{ instance_location }} </p>
						</div>
						<div class="col-md-6">
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>IPv4</b>: {{ primary_ipv4 }}</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>IPv6</b>: {{ primary_ipv6 }}</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>IPv6 Subnet</b>: {{ primary_ipv6_subnet }}</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>Private IPv4</b>: {{ private_ipv4 }}</p>
							<p><i aria-hidden="true" class="far fa-dot-circle"></i> <b>Hypervisor</b>: {{ instance.hypervisor.name }}</p>
							<p v-if="instance.plan_id !== '' && instance.plan_id !== '0'">
								<i aria-hidden="true" class="far fa-dot-circle"></i> <b>Plan</b>: {{ instance.plan.name }}
							</p>
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
				<div v-if="enabledBilling && !is_reseller && !is_subuser && instance.plan_id !== '' && instance.plan_id !== 0 && instance.plan.upgrades.length > 0" id="upgrade" :class="{'active': $route.query.tab === 'upgrade'}"
					 class="wow fadeIn tab-pane"
					 role="tabpanel">
					<h3>Upgrade Instance</h3>
					<p>Pick a server detail & pricing plan you wish to upgrade to.</p>
					<div class="row">
						<div v-for="upgrade in instance.plan.upgrades" class="col-md-4"
							 @click.prevent="$set($data,'upgrade_plan',upgrade.id)">
							<div :class="{active: upgrade_plan === upgrade.id}" class="rev">
								<h4>{{ upgrade.name }}</h4>
								<hr>
								<p><b>{{ upgrade.cpu_cores }}</b> CPU</p>
								<p><b>{{ upgrade.ram / 1024 }}</b>GB Memory</p>
								<p>
									<b>{{ upgrade.disk_size > 1024 ? upgrade.disk_size / 1024 + 'TB' : upgrade.disk_size + 'GB' }}</b>
									{{ upgrade.disk_type }} Disk</p>
								<p><b>{{ upgrade.bandwidth }}</b>GB Bandwidth</p>
								<div class="name"><b>{{ $currencyFormat(upgrade.price) }}/mo*</b></div>
							</div>
						</div>
					</div>
					<br><br>
					<a href="#">
						<button :disabled="disableAction || instance_suspended || instance_network_suspended" class="btn btn-primary"
								@click.prevent="upgrade_instance">Upgrade
							Instance
						</button>
					</a>
				</div>
				<div id="settings" :class="{'active': $route.query.tab === 'settings'}" class="wow fadeIn tab-pane" role="tabpanel">
					<br/>
					<div class="row">
						<div class="col-md-3">
							<div class="smenu">
								<h3><a @click.prevent="sidemenu"><i aria-hidden="true" class="fa fa-bars"></i> Settings</a>
								</h3>
								<ul id="sidemenu" class="animated fadeIn nav nav-tabs" role="tablist">
									<li :class="{'active': $route.query.subtab === 'disk'}" role="presentation">
										<a aria-controls="home" data-toggle="tab" href="#disk" role="tab" @click.prevent="tab('settings','disk')">
											<i aria-hidden="true" class="fas fa-power-off"></i> Disk Settings
										</a>
									</li>
									<li :class="{'active': $route.query.subtab === 'recipe'}" role="presentation">
										<a aria-controls="home" data-toggle="tab" href="#disk"
										   role="tab" @click.prevent="tab('settings','recipe')">
											<i class="fas fa-scroll"></i> Install Recipe
										</a>
									</li>
									<li :class="{'active': $route.query.subtab === 'rescue'}" role="presentation">
										<a aria-controls="rescue" data-toggle="tab" href="#rescue" role="tab" @click.prevent="tab('settings','rescue')">
											<i aria-hidden="true" class="fa fa-life-ring"></i> Rescue
										</a>
									</li>
									<li :class="{'active': $route.query.subtab === 'firewall'}" role="presentation">
										<a aria-controls="messages" data-toggle="tab" href="#firewall" role="tab" @click.prevent="tab('settings','firewall')">
											<i aria-hidden="true" class="fa fa-ban"></i> Firewall
										</a>
									</li>
									<li :class="{'active': $route.query.subtab === 'network'}" role="presentation">
										<a aria-controls="home" data-toggle="tab" href="#network" role="tab" @click.prevent="tab('settings','network')">
											<i aria-hidden="true" class="fa fa-globe"></i> Network
										</a>
									</li>
									<li :class="{'active': $route.query.subtab === 'custom-iso'}" role="presentation">
										<a aria-controls="settings" data-toggle="tab" href="#custom-iso" role="tab" @click.prevent="tab('settings','custom-iso')">
											<i aria-hidden="true" class="fas fa-compact-disc"></i> Custom ISO
										</a>
									</li>
									<li :class="{'active': $route.query.subtab === 'hostname'}" role="presentation">
										<a aria-controls="settings" data-toggle="tab" href="#hostname" role="tab" @click.prevent="tab('settings','hostname')">
											<i aria-hidden="true" class="fa fa-cog"></i> Change Hostname
										</a>
									</li>
									<li :class="{'active': $route.query.subtab === 'password'}" role="presentation">
										<a aria-controls="settings" data-toggle="tab" href="#password" role="tab" @click.prevent="tab('settings','password')">
											<i aria-hidden="true" class="fas fa-key"></i> Change Password
										</a>
									</li>
									<li :class="{'active': $route.query.subtab === 'os'}" role="presentation">
										<a aria-controls="settings" data-toggle="tab" href="#os" role="tab" @click.prevent="tab('settings','os')">
											<i aria-hidden="true" class="fab fa-linux"></i> Change OS
										</a>
									</li>
									<li :class="{'active': $route.query.subtab === 'vnc'}" role="presentation">
										<a aria-controls="vnc" data-toggle="tab" href="#vnc" role="tab" @click.prevent="tab('settings','vnc')">
											<i aria-hidden="true" class="fa fa-terminal"></i> VNC Details
										</a>
									</li>
									<li :class="{'active': $route.query.subtab === 'tasks'}" role="presentation">
										<a aria-controls="tasks" data-toggle="tab" href="#tasks" role="tab" @click.prevent="tab('settings','tasks')">
											<i aria-hidden="true" class="fas fa-tasks"></i> Tasks
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div class="col-md-9">
							<div class="tab-content">
								<div id="recipe" :class="{'active in': $route.query.subtab === 'recipe'}" class="tab-pane" role="tabpanel">
									<h4><b>Install Recipe</b></h4>
									<br><br>
									<div class="row">
										<div class="col-md-5">
											<select2 :name="'recipes[]'" multiple data-width="100%"></select2>
											<br>
											<button :disabled="disableAction" class="btn btn-primary" role="button" type="button" @click.prevent="install_recipes()">
												Install
											</button>
										</div>
									</div>
								</div>
								<div id="disk" :class="{'active in': $route.query.subtab === 'disk'}" class="tab-pane" role="tabpanel">
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
											<br>
											<button :disabled="disableAction" class="btn btn-primary" role="button"
													type="button" @click.prevent="change_boot()">Save
												Changes
											</button>
										</div>
										<div class="col-md-5">
											<p><b>Disk Driver</b>:</p>
											<br>
											<select v-model="disk_driver" class="js-example-basic-single form-control" data-width="100%" name="driver">
												<option value="virtio">Virtio</option>
												<option value="virtio-scsi">Virtio SCSI</option>
												<option value="ide">IDE</option>
												<option value="scsi">SCSI</option>
											</select>
											<br>
											<button :disabled="disableAction" class="btn btn-primary" role="button" type="button" @click.prevent="change_driver()">Save Changes</button>
										</div>
									</div>
									<br>
									<p style="color: #969696;">* A reboot is required for changes to apply.</p>
								</div>
								<div id="network" :class="{'active in': $route.query.subtab === 'network'}"
									 class="tab-pane" role="tabpanel">
									<h4><b>Public Network</b></h4>
									<br>
									<div class="table-responsive">
										<table class="table">
											<thead>
											<tr>
												<th>Address</th>
												<th>Netmask</th>
												<th>Gateway</th>
												<th>Version</th>
												<th>Type</th>
												<th>Primary</th>
												<!--<th>Reverse DNS</th>-->
											</tr>
											</thead>
											<tbody>
											<tr v-for="ip in instance.ips">
												<td>{{ ip.ip }}</td>
												<td v-if="ip.version === 'v6_subnet'">{{ ip.ip_mask }}</td>
												<td v-else>{{ ip.network.netmask }}</td>
												<td>{{ ip.network.gateway }}</td>
												<td>{{ ip.network.version }}</td>
												<td>{{ ip.network.type }}</td>
												<td>
													<a :class="{disabled: ip.primary === 1}" href="#">
														<button class="btn btn-default" style="float: right;" @click.prevent="change_primaryip(ip.id)"><i aria-hidden="true" class="fa fa-check"></i></button>
													</a>
												</td>
											</tr>
											</tbody>
										</table>
									</div>
								</div>
								<div id="firewall" :class="{'active in': $route.query.subtab === 'firewall'}"
									 class="tab-pane fade" role="tabpanel">
									<h4><b>Firewall</b></h4>
									<p>Select a firewall for your instance. </p>
									<br>
									<select class="form-control firewall-select2 select2-hidden-accessible"
											data-width="100%" name="firewall_id"></select>
									<br>
									<a href="#" @click="update_firewall()">
										<button :disabled="disableAction" class="btn btn-primary">Select</button>
									</a>
									<br><br>
									<p style="text-decoration: underline;">
										<nuxt-link :to="{name: 'user-firewall-create'}" tag="a">Don't have one
											already?
										</nuxt-link>
									</p>
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
													<select class="js-example-basic-single form-control" data-width="100%"
															name="iso_id">

													</select>
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
													<select class="js-example-basic-single form-control"
															data-width="100%" name="secondary_iso_id">

													</select>
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
									<select id="image_id" class="js-example-basic-single form-control" data-width="100%"
											name="image_id">
									</select>
									<br>
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

									<button v-if="instance.enabled_rescue === 0" :disabled="disableAction || instance_suspended || instance_network_suspended" class="btn btn-success" @click.prevent="action('enable_rescue')">Enable Rescue Mode
									</button>
									<button v-else :disabled="disableAction || instance_suspended || instance_network_suspended" class="btn btn-danger" @click="action('disable_rescue')">Disable Rescue Mode
									</button>
									<br>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="resources" :class="{'active': $route.query.tab === 'resources'}" class="wow fadeIn rseller tab-pane" role="tabpanel">
					<form id="instance-update-form" @submit.prevent="resource_update">
						<div class="row">
							<div class="col-md-4">
								<div :class="{'has-error': errors.user_id}" class="form-group">
									<label> Select User</label>
									<select class="form-control input-lg" data-width="100%" name="user_id">
										<option value=""></option>
									</select>
									<span v-if="errors.user_id" class="help-block">{{ errors.user_id[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div :class="{'has-error': errors.cpu_cores}" class="form-group">
									<label> CPU Cores</label>
									<div class="input-group">
										<input v-model="instance.cpu_cores" class="form-control input-lg" name="cpu_cores"
											   type="number">
										<div class="input-group-addon">
											{{ reseller_limits.cpu_cores }}
										</div>
									</div>
									<span v-if="errors.cpu_cores" class="help-block">{{ errors.cpu_cores[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4">
								<div :class="{'has-error': errors.ram}" class="form-group">
									<label> RAM (in MB)</label>
									<div class="input-group">
										<input v-model="instance.ram" class="form-control input-lg" name="ram"
											   type="number">
										<div class="input-group-addon">
											{{ reseller_limits.ram }}MB
										</div>
									</div>
									<span v-if="errors.ram" class="help-block">{{ errors.ram[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div :class="{'has-error': errors.disk_size}" class="form-group">
									<label> Disk (in GB)</label>
									<div class="input-group">
										<input v-model="disk_size" class="form-control input-lg" name="disk_size"
											   type="number">
										<div class="input-group-addon">
											{{ $Gb2Tb(reseller_limits.disk_size) }}
										</div>
									</div>
									<span v-if="errors.disk_size" class="help-block">{{ errors.disk_size[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4">
								<div :class="{'has-error': errors.bandwidth}" class="form-group">
									<label> Bandwidth (in GB)</label>
									<div class="input-group">
										<input v-model="instance.bandwidth" class="form-control input-lg" name="bandwidth"
											   type="number">
										<div class="input-group-addon">
											{{ $Gb2Tb(reseller_limits.bandwidth) }}
										</div>
									</div>
									<span v-if="errors.bandwidth" class="help-block">{{ errors.bandwidth[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group">
									<label>Network Driver</label>
									<select name="nic_type" class="form-control" v-model="instance.nic_type">
										<option value="virtio">VirtIO</option>
										<option value="rtl8139">Realtek 8139</option>
										<option value="e1000">e1000</option>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4">
								<div :class="{'has-error': errors.ipv4_count}" class="form-group">
									<label> IPv4 Addresses</label>
									<div class="input-group">
										<input v-model="public_ipv4_list.length" class="form-control input-lg" name="ipv4_count"
											   type="number">
										<div class="input-group-addon">
											{{ reseller_limits.ipv4_count }}
										</div>
									</div>
									<span v-if="errors.ipv4_count" class="help-block">{{ errors.ipv4_count[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div :class="{'has-error': errors.ipv6_count}" class="form-group">
									<label> IPv6 Addresses</label>
									<div class="input-group">
										<input v-model="public_ipv6_list.length" class="form-control input-lg" name="ipv6_count"
											   type="number">
										<div class="input-group-addon">
											{{ reseller_limits.ipv6_count }}
										</div>
									</div>
									<span v-if="errors.ipv6_count" class="help-block">{{ errors.ipv6_count[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div :class="{'has-error': errors.ipv6_subnet_count}" class="form-group">
									<label> IPv6 Subnets</label>
									<div class="input-group">
										<input v-model="public_ipv6_subnet_list.length" class="form-control input-lg" name="ipv6_subnet_count"
											   type="number">
										<div class="input-group-addon">
											{{ reseller_limits.ipv6_subnet_count }}
										</div>
									</div>
									<span v-if="errors.ipv6_subnet_count" class="help-block">{{ errors.ipv6_subnet_count[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6 firewall-manage">
								<br>
								<button :class="{disabled: processing}" :disabled="processing" class="btn btn-primary normal"
										type="submit">
									<span v-if="processing"><i class="fa fa-spin fa-spinner"></i> Updating</span>
									<span v-else><i class="fa fa-edit"></i> Update</span>
								</button>
							</div>
						</div>
					</form>
				</div>
				<div id="snapshots" :class="{'active': $route.query.tab === 'snapshots'}" class="wow fadeIn tab-pane" role="tabpanel">
					<h3>Snapshots</h3>
					<br>
					<div class="row">
						<div class="col-md-8">
							<h3>Live Snapshot</h3>
							<p class="less">Snapshot is an on-demand disk image of your primary disk of your virtual machine, you can use them to restore data to other instances in the same hypervisor.</p>
						</div>
					</div>
					<br>
					<button class="btn btn-success" :disabled="processing || running_task" @click.prevent="create_snapshot()"><i class="fa fa-camera-retro"></i> Take Snapshot</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import pagination from '~/components/pagination.vue'
import Select2 from '~/components/bootstrap/select2.vue'
export default {
	layout: 'user',
	head: {
		title: 'Manage Instance'
	},
	components: {
		pagination,
		Select2
	},
	watch: {},
	data() {
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
			reseller_limits: {},
			upgrade_plan: 0,
			instance_statuses: {
				'1': 'Running',
				'0': 'Stopped',
				'2': 'Suspended',
				'5': 'Suspended'
			},
			tasks: {
				create_instance: 'Deploying',
				rebuild_instance: 'Re-Deploying',
				start_instance: 'Booting',
				stop_instance: 'Powering Off',
				shutdown_instance: 'Shutting Down',
				restart_instance: 'Rebooting',
				destroy_instance: 'Destroying',
				resume_instance: 'Resuming',
				suspend_instance: 'Suspending',
				create_snapshot: 'Creating Snapshot'
			},
		}
	},
	methods: {
		async get_instance() {
			await this.$axios.get('/user/instances/' + this.$route.params.id).then((response) => {
				this.instance = response.data;
				this.update_tasks();
			}).catch((error) => {
				this.$router.push({name: 'user-dashboard'});
			});
		},
		tab(tab, subtab = '') {
			if (tab === 'settings' && subtab === '') {
				subtab = 'disk'
			}
			if (tab === 'settings') {
				if (this.$route.query.tab !== tab || this.$route.query.subtab !== subtab) {
					this.$router.replace({
						path: '/user/instance/' + this.$route.params.id,
						query: {tab: tab, subtab: subtab}
					});
				}
			} else {
				if (this.$route.query.tab !== tab) {
					this.$router.replace({path: '/user/instance/' + this.$route.params.id, query: {tab: tab}});
				}
			}
		},
		async get_images() {
			let response = await this.$axios.get('/user/images').catch(() => {
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
						let response = await this.$axios.get('user/images', {params: {page: i}}).catch(() => {
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
			let response = await this.$axios.get('user/isos').catch(() => {
			});
			if (response) {
				let isos = {}, isoselect = [];
				response.data.data.forEach((iso, k) => {
					if (!isos[iso.distro]) {
						isos[iso.distro] = [];
					}
					isos[iso.distro].push({id: iso.id, text: iso.name});
				});
				if (response.data.last_page > 1) {
					for (let i = 2; i <= response.data.data; i++) {
						let response = await this.$axios.get('user/isos', {params: {page: i}}).catch(() => {
						});
						if (response) {
							response.data.data.forEach((iso, k) => {
								if (!isos[iso.distro]) {
									isos[iso.distro] = [];
								}
								isos[iso.distro].push({id: iso.id, text: iso.name});
							});
						}
					}
				}

				$.each(isos, (k, v) => {
					let group = k.substring(0, 1).toUpperCase() + k.substring(1).toLowerCase();
					isoselect.push({text: group, children: v});
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
			await this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: action
			}).then(() => {
				this.get_instance();
			}).catch((error) => {
				this.processing = false;
			});
			this.processing = false;
		},
		create_snapshot(){
			this.$set(this, 'processing', true);
			this.$axios.post('/user/snapshots', {
				instance_id: this.$route.params.id
			}).then((response) => {
				this.get_instance()
				this.$set(this, 'processing', false);
			}).catch(() => {
				this.$set(this, 'processing', false);
			});
		},
		resource_update() {
			this.$set(this, 'processing', true);
			this.$axios.patch('/user/instance/' + this.$route.params.id, $('form#instance-update-form').serialize()).then((response) => {
				this.$set(this, 'processing', false);
			}).catch(() => {
				this.$set(this, 'processing', false);
			});
		},
		update() {
			this.$set(this, 'processing', true);
			this.$axios.patch('/user/instance/' + this.$route.params.id, {
				vnc_password: $('[name="vnc_password"]').val(),
				vnc_keymap: $('[name="vnc_keymap"]').val()
			}).then((response) => {
				this.$set(this, 'processing', false);
			}).catch(() => {
				this.$set(this, 'processing', false);
			});
		},
		change_boot() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'change_boot', boot: $('[name="boot"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},
		change_primaryip(ip) {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'change_primaryip', ip: ip
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},
		update_firewall() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'update_firewall', firewall_id: $('[name="firewall_id"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},
		change_password() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'change_password', password: $('[name="password"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},
		change_hostname() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'change_hostname', hostname: $('[name="hostname"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},
		change_nic() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'change_nic', nic_type: $('[name="nic_type"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},
		mount_piso() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'mount_primaryiso', iso_id: $('[name="iso_id"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},
		umount_piso() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'unmount_primaryiso'
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});


		},
		mount_siso() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'mount_secondaryiso', secondary_iso_id: $('[name="secondary_iso_id"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},
		umount_siso() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'unmount_secondaryiso'
			}).then(() => {
				this.$set(this, 'processing', false);
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},
		async reinstall() {
			this.$set(this, "processing", true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'reinstall',
				image_id: $('[name="image_id"]').val()
			}).then(() => {
				this.$set(this, "processing", false);
				vm.$options.asyncData(vm.$root.$options.context);
			}).catch((error) => {
				this.$set(this, "processing", false);
			});
		},
		novnc() {
			this.$axios.get('user/instance/' + this.$route.params.id + '/novnc').then((response) => {
				var x = window.open('', '', 'height=768px,width=1024px');
				x.document.open();
				x.document.write(response.data);
				x.document.close();
			});
		},
		async update_tasks() {
			let vm = this;
			clearInterval(vm.polling);
			if (vm.instance.tasks && vm.instance.tasks.length >= 1) {
				vm.instance.tasks.forEach((task, k) => {
					if ($.inArray(task.status, ['done', 'failed']) === -1) {
						vm.$set(vm, "running_task", true);
						vm.poll_tasks.push(task.id);
					}
				});
			} else {
				vm.$set(vm, "running_task", false);
			}
			if (vm.running_task) {
				vm.tab('settings', 'tasks');
			}
			vm.polling = setInterval(() => {
				vm.$axios.get('user/tasks', {
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
										vm.poll_tasks.splice(vm.poll_tasks.indexOf(tid), 1);
										this.get_instance();
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
		},
		upgrade_instance() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'upgrade_instance', plan_id: this.upgrade_plan
			}).then(() => {
				this.$set(this, 'processing', false);
				this.tab('overview');
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		},
		install_recipes() {
			this.$set(this, 'processing', true);
			this.$axios.post('/user/instance/' + this.$route.params.id, {
				action: 'install_recipe', recipes: $('[name="recipes[]"]').val()
			}).then(() => {
				this.$set(this, 'processing', false);
				this.tab('settings', 'recipe');
			}).catch((error) => {
				this.$set(this, 'processing', false);
			});
		}
	},
	async asyncData({$axios, params, route, redirect, store}) {
		let limits = {};
		if (store.state.auth.user.is_reseller === 1) {
			limits = await $axios.get('/user/reseller/resources');
		}
		let instance = await $axios.get('/user/instances/' + params.id).catch(() => {
			redirect('/user/dashboard');
		});
		return {
			instance: instance.data,
			reseller_limits: limits.data ? limits.data.reseller_limits : {}
		}
	},
	mounted() {
		let vm = this;
		$('[name="recipes[]"]').select2({
			placeholder: 'Select Recipes',
			tags: true,
			ajax: {
				url: vm.$axios.defaults.baseURL + '/user/recipes',
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
					let recipes = [];
					data.data.forEach((recipe) => {
						recipes.push({
							id: recipe.id,
							text: recipe.name,
							recipe: recipe
						});
					});
					return {
						results: recipes
					}
				},
				cache: true
			},
		});
		$('[name="firewall_id"]').select2({
			placeholder: 'Select Firewall',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/user/firewalls',
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
					let firewalls = [];
					data.data.forEach((firewall) => {
						firewalls.push({
							id: firewall.id,
							text: firewall.name,
							firewall: firewall,
							selected: vm.instance.firewall_id === firewall.id
						});
					});
					return {
						results: firewalls
					}
				},
				cache: true
			},
			data: vm.instance.firewall ? [{
				id: vm.instance.firewall_id,
				text: vm.instance.firewall.name,
				selected: true
			}] : []
		});
		let nic_types = {virtio: "VirtIO", e1000: "E1000", rtl8139: "Realtek 8139"};
		$('[name="nic_type"]').select2({
			data: [{
				id: vm.instance.nic_type,
				text: nic_types[vm.instance.nic_type],
				selected: true
			}]
		});
		$('[name="user_id"]').select2({
			placeholder: 'Select User',
			allowClear: true,
			ajax: {
				url: this.$axios.defaults.baseURL + '/user/reseller/subusers',
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
					let users = [];
					data.data.forEach((user) => {
						users.push({id: user.id, text: user.email});
					});
					return {
						results: users
					}
				},
				cache: true
			},
			data: [{
				id: vm.instance.user_id,
				text: vm.instance.user ? vm.instance.user.email : 'No Email',
				selected: true
			}]
		});
		if (this.$route.query.tab) {
			let tab = this.$route.query.tab;
			let subtab = this.$route.query.subtab;
			vm.tab(tab, subtab);
		} else {
			vm.tab('overview');
		}
		$('.js-example-basic-single').select2({});
		$('.vnc_keymap').select2().on('change', function () {
			vm.change_vnckeymap($(this).val());
		});
		this.get_images();
		this.get_isos();
		this.update_tasks();
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
					pip = ip.ip + '/' + ip.ip_mask
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
		is_reseller() {
			let user = this.$store.state.auth.user;
			if (user.is_reseller === 1) {
				return true;
			}
		},
		is_subuser() {
			let user = this.$store.state.auth.user;
			return (user.is_reseller === 0 && user.owner_id !== '' && user.owner_id !== '0');
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
				if (this.instance.hypervisor.region && this.instance.hypervisor.region.length !== 0) {
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
		},
		is_migrating(){
			return this.instance.migration && this.instance.migration.id;
		}
	}
}

</script>
