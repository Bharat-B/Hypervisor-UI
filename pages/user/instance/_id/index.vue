<template>
	<div class="dashcontent instance-s">
		<h1 style="font-size: 14pt;"><img :src="'/assets/'+instance.os_distro+'.png'"/> {{ instance.hostname }}</h1>
		<p>
			<nuxt-link :to="{name: 'user-dashboard'}">
				<button class="btn btn-default"><i class="far fa-caret-square-left" aria-hidden="true"></i>&nbsp; All
					Instances
				</button>
			</nuxt-link>
		</p>
		<div class="cpanel">
			<a href="#" @click.prevent="action('start')"
			   :class="{disabled:  disableAction || instance_running || instance_suspended || instance_network_suspended }"><i
				class="fa fa-play" aria-hidden="true"></i> <span>Start</span></a>
			<a href="#" @click.prevent="action('stop')"
			   :class="{disabled:  disableAction || instance_stopped || instance_suspended || instance_network_suspended }"
			   data-toggle="tooltip" data-placement="bottom" title="Stop this server"><i class="fa fa-stop"
																						 aria-hidden="true"></i> <span>Stop</span></a>
			<a href="#" @click.prevent="action('restart')"
			   :class="{disabled: disableAction || instance_suspended || instance_network_suspended }"
			   data-toggle="tooltip" data-placement="bottom" title="Restart this server"><i class="fas fa-redo"
																							aria-hidden="true"></i>
				<span>Restart</span></a>
			<a href="#" @click.prevent="novnc" :class="{disabled:  disableAction || instance_stopped }"
			   data-toggle="tooltip" data-placement="bottom" title="Open console"><i class="fa fa-terminal"
																					 aria-hidden="true"></i> <span>Console</span></a>

			<a href="#" @click.prevent="action('suspend')" :class="{disabled: disableAction || instance_suspended }"
			   v-if="!instance_suspended && is_reseller" data-toggle="tooltip" data-placement="bottom"
			   title="Suspend"><i class="fas fa-pause" aria-hidden="true"></i> <span>Suspend</span></a>
			<a href="#" @click.prevent="action('resume')" :class="{disabled: disableAction && !instance_suspended }"
			   v-if="instance_suspended && is_reseller" data-toggle="tooltip" data-placement="bottom" title="Unsuspend"><i
				class="fas fa-play" aria-hidden="true"></i> <span>Unsuspend</span></a>
			<a href="#" @click.prevent="action('suspend_network')"
			   :class="{disabled: disableAction || instance_network_suspended }"
			   v-if="!instance_network_suspended && is_reseller" data-toggle="tooltip" data-placement="bottom"
			   title="Suspend"><i class="fas fa-wifi" aria-hidden="true"></i> <span>Suspend Network</span></a>
			<a href="#" @click.prevent="action('resume_network')"
			   :class="{disabled: disableAction || !instance_network_suspended }"
			   v-if="instance_network_suspended && is_reseller" data-toggle="tooltip" data-placement="bottom"
			   title="Unsuspend Network"><i class="fas fa-wifi" aria-hidden="true"></i>
				<span>Unsuspend Network</span></a>

			<a href="#" @click.prevent="action('destroy')"
			   :class="{disabled: disableAction || instance_suspended || instance_network_suspended }"
			   v-if="enabledBilling || is_reseller" data-toggle="tooltip" data-placement="bottom" title="Destroy"
			   class="hide"><i class="fas fa-trash" aria-hidden="true"></i></a>
		</div>
		<div class="dashstuff">
			<ul class="nav nav-tabs" role="tablist">
				<li role="presentation" :class="{active: $route.query.tab === 'overview'}">
					<a href="#overview" @click.prevent="tab('overview')" aria-controls="overview" role="tab"
					   data-toggle="tab"><i class="fas fa-tachometer-alt" aria-hidden="true"></i> Overview</a>
				</li>
				<li role="presentation" :class="{active: $route.query.tab === 'upgrade'}"
					v-if="enabledBilling && !is_reseller && !is_subuser && instance.plan_id !== '' && instance.plan_id !== 0 && instance.plan.upgrades.length > 0">
					<a href="#upgrade" @click.prevent="tab('upgrade')" aria-controls="upgrade" role="tab"
					   data-toggle="tab"><i class="fa fa-plus-square" aria-hidden="true"></i> Upgrade</a>
				</li>
				<li role="presentation"
					:class="{active: $route.query.tab === 'settings', last: user.is_reseller === 0}">
					<a href="#settings" @click.prevent="tab('settings')" aria-controls="settings" role="tab"
					   data-toggle="tab"><i class="fas fa-sliders-h" aria-hidden="true"></i> Settings</a>
				</li>
				<li class="last" role="presentation" :class="{'active': $route.query.tab === 'resources'}"
					v-if="is_reseller">
					<a href="#resources" @click.prevent="tab('resources')" aria-controls="resources" role="tab"
					   data-toggle="tab"><i class="fa fa-cog" aria-hidden="true"></i> Resources</a>
				</li>
			</ul>
			<div class="tab-content">
				<div role="tabpanel" class="wow fadeIn tab-pane" :class="{'active': $route.query.tab === 'overview'}"
					 id="overview">
					<h3>Overview</h3>
					<br/>
					<div class="charges" v-if="enabledBilling && !is_reseller && !is_subuser">
						<p>Current Charges</p>
						<b>{{ currentCharges }}</b>
					</div>
					<div class="row details">
						<div class="col-md-6">
							<p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Status</b>: {{ instance_status }}</p>
							<p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>OS</b>: {{ instance.os }}</p>
							<p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>CPU</b>: {{ instance.cpu_cores }}
								vCore(s) </p>
							<p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>RAM</b>: {{
									$Mb2Gb(instance.ram)
								}} </p>
							<p v-if="instance.disks.length > 0"><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Storage:</b>:
								{{ $Gb2Tb(instance.disks[0].size) }} SSD</p>
							<p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Location</b>:
								{{ instance_location }} </p>
						</div>
						<div class="col-md-6">
							<p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>IPv4</b>: {{ primary_ipv4 }}</p>
							<p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>IPv6</b>: {{ primary_ipv6 }}</p>
							<p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>IPv6 Subnet</b>: {{ primary_ipv6_subnet }}</p>
							<p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Private IPv4</b>: {{ private_ipv4 }}</p>
							<p><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Hypervisor</b>: {{ instance.hypervisor.name }}</p>
							<p v-if="instance.plan_id !== '' && instance.plan_id !== '0'"><i class="far fa-dot-circle" aria-hidden="true"></i> <b>Plan</b>: {{ instance.plan.name }}</p>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<b>Bandwidth Usage</b>
							<p class="less" v-if="instance.bandwidth !== 0">{{ instance.used_bandwidth }}GB of
								{{ instance.bandwidth }}GB</p>
							<div class="progress">
								<div class="progress-bar progress-bar-striped active" role="progressbar"
									 :aria-valuenow="instance_used_bandwidth_percent" aria-valuemin="0"
									 aria-valuemax="100" :style="{width: instance_used_bandwidth_percent+'%'}">
									{{ instance_used_bandwidth_percent }}%
								</div>
							</div>
						</div>
					</div>
				</div>
				<div role="tabpanel" class="wow fadeIn tab-pane" :class="{'active': $route.query.tab === 'upgrade'}"
					 id="upgrade"
					 v-if="enabledBilling && !is_reseller && !is_subuser && instance.plan_id !== '' && instance.plan_id !== 0 && instance.plan.upgrades.length > 0">
					<h3>Upgrade Instance</h3>
					<p>Pick a server detail & pricing plan you wish to upgrade to.</p>
					<div class="row">
						<div class="col-md-4" v-for="upgrade in instance.plan.upgrades"
							 @click.prevent="$set($data,'upgrade_plan',upgrade.id)">
							<div class="rev" :class="{active: upgrade_plan === upgrade.id}">
								<h4>{{ upgrade.name }}</h4>
								<hr>
								<p><b>{{ upgrade.cpu_cores }}</b> CPU</p>
								<p><b>{{ upgrade.ram / 1024 }}</b>GB Memory</p>
								<p><b>{{ upgrade.disk_size > 1024 ? upgrade.disk_size / 1024 + 'TB' : upgrade.disk_size + 'GB'}}</b> {{ upgrade.disk_type }} Disk</p>
								<p><b>{{ upgrade.bandwidth }}</b>GB Bandwidth</p>
								<div class="name"><b>{{ $currencyFormat(upgrade.price) }}/mo*</b></div>
							</div>
						</div>
					</div>
					<br><br>
					<a href="#">
						<button class="btn btn-primary" @click.prevent="upgrade_instance"
								:disabled="disableAction || instance_suspended || instance_network_suspended">Upgrade
							Instance
						</button>
					</a>
				</div>
				<div role="tabpanel" class="wow fadeIn tab-pane" :class="{'active': $route.query.tab === 'settings'}"
					 id="settings">
					<br/>
					<div class="row">
						<div class="col-md-3">
							<div class="smenu">
								<h3><a @click.prevent="sidemenu"><i class="fa fa-bars" aria-hidden="true"></i> Settings</a>
								</h3>
								<ul class="animated fadeIn nav nav-tabs" id="sidemenu" role="tablist">
									<li role="presentation" :class="{'active': $route.query.subtab === 'disk'}"><a
										href="#disk" @click.prevent="tab('settings','disk')" aria-controls="home"
										role="tab" data-toggle="tab"><i class="fas fa-power-off" aria-hidden="true"></i>
										Disk Settings</a></li>
									<li role="presentation" :class="{'active': $route.query.subtab === 'rescue'}"><a
										href="#rescue" @click.prevent="tab('settings','rescue')" aria-controls="rescue"
										role="tab" data-toggle="tab"><i class="fa fa-life-ring" aria-hidden="true"></i>
										Rescue</a></li>
									<li role="presentation" :class="{'active': $route.query.subtab === 'network'}"><a
										href="#network" @click.prevent="tab('settings','network')" aria-controls="home"
										role="tab" data-toggle="tab"><i class="fa fa-globe" aria-hidden="true"></i>
										Public Network</a></li>
									<li role="presentation" :class="{'active': $route.query.subtab === 'firewall'}"><a
										href="#firewall" @click.prevent="tab('settings','firewall')"
										aria-controls="messages" role="tab" data-toggle="tab"><i class="fa fa-ban"
																								 aria-hidden="true"></i>
										Firewall</a></li>
									<li role="presentation" :class="{'active': $route.query.subtab === 'custom-iso'}"><a
										href="#custom-iso" @click.prevent="tab('settings','custom-iso')"
										aria-controls="settings" role="tab" data-toggle="tab"><i
										class="fas fa-compact-disc" aria-hidden="true"></i> Custom ISO</a></li>
									<li role="presentation" :class="{'active': $route.query.subtab === 'hostname'}"><a
										href="#hostname" @click.prevent="tab('settings','hostname')"
										aria-controls="settings" role="tab" data-toggle="tab"><i class="fa fa-cog"
																								 aria-hidden="true"></i>
										Change Hostname</a></li>
									<li role="presentation" :class="{'active': $route.query.subtab === 'password'}"><a
										href="#password" @click.prevent="tab('settings','password')"
										aria-controls="settings" role="tab" data-toggle="tab"><i class="fas fa-key"
																								 aria-hidden="true"></i>
										Change Password</a></li>
									<li role="presentation" :class="{'active': $route.query.subtab === 'os'}"><a
										href="#os" @click.prevent="tab('settings','os')" aria-controls="settings"
										role="tab" data-toggle="tab"><i class="fab fa-linux" aria-hidden="true"></i>
										Change OS</a></li>
									<li role="presentation" :class="{'active': $route.query.subtab === 'vnc'}"><a
										href="#vnc" @click.prevent="tab('settings','vnc')" aria-controls="vnc"
										role="tab" data-toggle="tab"><i class="fa fa-terminal" aria-hidden="true"></i>
										VNC Details</a></li>
									<li role="presentation" :class="{'active': $route.query.subtab === 'tasks'}"><a
										href="#tasks" @click.prevent="tab('settings','tasks')" aria-controls="tasks"
										role="tab" data-toggle="tab"><i class="fas fa-tasks" aria-hidden="true"></i>
										Tasks</a></li>
								</ul>

							</div>
						</div>
						<div class="col-md-9">
							<div class="tab-content">
								<div role="tabpanel" class="tab-pane"
									 :class="{'active in': $route.query.subtab === 'disk'}" id="disk">
									<h4><b>Disk Settings</b></h4>
									<br><br>
									<div class="row">
										<div class="col-md-5">
											<p><b>Boot Order</b>: </p>
											<br>
											<select class="js-example-basic-single form-control" name="boot"
													v-model="instance.boot" data-width="100%">
												<option value="cda">(1) CD Rom (2) Hard Disk</option>
												<option value="cdrom">CD Rom</option>
												<option value="hd">Hard Disk</option>
											</select>
											<br>
											<button class="btn btn-primary" role="button" type="button"
													@click.prevent="change_boot()" :disabled="disableAction">Save
												Changes
											</button>
										</div>
										<div class="col-md-5">
											<p><b>Disk Driver</b>:</p>
											<br>
											<select class="js-example-basic-single form-control" name="driver"
													v-model="disk_driver" data-width="100%">
												<option value="default">IDE</option>
												<option value="virtio">Virtio</option>
												<option value="scsi">SCSI</option>
											</select>
											<br>
											<button class="btn btn-primary" role="button" type="button"
													@click.prevent="change_driver()" :disabled="disableAction">Save
												Changes
											</button>
										</div>
									</div>
									<br>
									<p style="color: #969696;">* A reboot is required for changes to apply.</p>
								</div>
								<div role="tabpanel" class="tab-pane"
									 :class="{'active in': $route.query.subtab === 'network'}" id="network">
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
												<td>{{ ip.network.netmask }}</td>
												<td>{{ ip.network.gateway }}</td>
												<td>{{ ip.network.version }}</td>
												<td>{{ ip.network.type }}</td>
												<td>
													<a :class="{disabled: ip.primary === 1}" href="#">
														<button style="float: right;" class="btn btn-default"
																@click.prevent="change_primaryip(ip.id)"><i
															class="fa fa-check" aria-hidden="true"></i></button>
													</a>
												</td>
											</tr>
											</tbody>
										</table>
									</div>
								</div>
								<div role="tabpanel" class="tab-pane fade"
									 :class="{'active in': $route.query.subtab === 'firewall'}" id="firewall">
									<h4><b>Firewall</b></h4>
									<p>Select a firewall for your instance. </p>
									<br>
									<select class="form-control firewall-select2 select2-hidden-accessible"
											name="firewall_id" data-width="100%"></select>
									<br>
									<a href="#" @click="update_firewall()">
										<button class="btn btn-primary" :disabled="disableAction">Select</button>
									</a>
									<br><br>
									<p style="text-decoration: underline;">
										<nuxt-link :to="{name: 'user-firewall-create'}" tag="a">Don't have one
											already?
										</nuxt-link>
									</p>
								</div>
								<div role="tabpanel" class="tab-pane fade"
									 :class="{'active in': $route.query.subtab === 'custom-iso'}" id="custom-iso">
									<h4><b>ISO Library</b></h4>
									<p>Choose from our library of ISO, make sure you backup everything before
										continuing.</p>
									<br>
									<div class="row">
										<div class="col-md-6">
											<div class="form-group">
												<label>Primary ISO</label>
												<div class="controls">
													<select class="js-example-basic-single form-control" name="iso_id"
															data-width="100%">

													</select>
												</div>
											</div>
											<button class="btn btn-primary" @click.prevent="mount_piso"
													v-if="instance.iso_id === '' || instance.iso_id === 0"
													:disabled="disableAction">Mount
											</button>
											<button class="btn btn-primary" @click.prevent="umount_piso" v-else
													:disabled="disableAction">Unmount
											</button>
										</div>
										<div class="col-md-6">
											<div class="form-group">
												<label>Secondary ISO</label>
												<div class="controls">
													<select class="js-example-basic-single form-control"
															name="secondary_iso_id" data-width="100%">

													</select>
												</div>
											</div>
											<button class="btn btn-primary" @click.prevent="mount_siso"
													v-if="instance.secondary_iso_id === '' || instance.secondary_iso_id === 0"
													:disabled="disableAction">Mount
											</button>
											<button class="btn btn-primary" @click.prevent="umount_siso" v-else
													:disabled="disableAction">Unmount
											</button>
										</div>
									</div>
									<br><br>
									<p style="color: #969696;">* By installing an ISO, all the current data will be
										lost.</p>
								</div>
								<div role="tabpanel" class="tab-pane fade"
									 :class="{'active in': $route.query.subtab === 'hostname'}" id="hostname">
									<h4><b>Change Hostname</b></h4>
									<br>
									<input class="form-control add-reverse"
										   style="height: 50px !important;; width: 40%; display: inline-block;"
										   v-model="instance.hostname" name="hostname">
									<br>
									<button class="btn btn-primary" type="button" role="button"
											@click.prevent="change_hostname" :disabled="disableAction">Change Hostname
									</button>
								</div>
								<div role="tabpanel" class="tab-pane fade"
									 :class="{'active in': $route.query.subtab === 'password'}" id="password">
									<h4><b>Change Password</b></h4>
									<br>
									<input class="form-control add-reverse" type="password"
										   style="height: 50px !important;; width: 40%; display: inline-block;"
										   name="password">
									<br>
									<button class="btn btn-primary" type="button" role="button"
											@click.prevent="change_password" :disabled="disableAction">Change Password
									</button>
								</div>
								<div role="tabpanel" class="tab-pane fade"
									 :class="{'active in': $route.query.subtab === 'os'}" id="os">

									<h4><b>Change OS</b></h4>
									<p><b>Currently Installed</b>: {{ instance.os }}</p>
									<br>
									<select class="js-example-basic-single form-control" name="image_id" id="image_id"
											data-width="100%">
									</select>
									<br>
									<button class="btn btn-primary" type="button" role="button"
											@click.prevent="reinstall" :disabled="disableAction">Change OS
									</button>
									<br><br>
									<p style="color: #969696;">* Warning: Changing to a different operating system will
										wipe all the data on your server.</p>

								</div>
								<div role="tabpanel" class="tab-pane fade"
									 :class="{'active in': $route.query.subtab === 'vnc'}" id="vnc">
									<h4><b>VNC Details</b></h4>
									<br><br>
									<div class="row">
										<div class="col-md-4">
											<p><b>VNC IP</b>: </p>
											<input class="form-control"
												   style="margin-top: 5px; width: 30%; display: inline-block; height: 51px; min-width: 190px;"
												   v-model="instance.hypervisor.ip" readonly>
											<br>
											<p><b>VNC Port</b>: </p>
											<input class="form-control"
												   style="margin-top: 5px; width: 30%; display: inline-block; height: 51px; min-width: 190px;"
												   v-model="instance.vnc_port" readonly>
										</div>
										<div class="col-md-6">
											<p><b>VNC Password</b>: </p>
											<input class="form-control" style="width: 30%; display: inline-block; height: 51px; min-width: 190px;" placeholder="Password" name="vnc_password" v-model="instance.vnc_password">
											<br>
											<p style="margin-bottom: 15px;"><b>VNC Keymap</b>: </p>
											<select class="vnc_keymap form-control" name="vnc_keymap" data-width="100%"
													v-model="instance.vnc_keymap">
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
									<button class="btn btn-primary" @click.prevent="update()"
											:disabled="disableAction">Save Changes
									</button>
								</div>
								<div role="tabpanel" class="tab-pane fade"
									 :class="{'active in': $route.query.subtab === 'tasks'}" id="tasks">
									<h4><b>Tasks</b></h4>
									<p class="less">Most Recent Tasks</p>
									<br>
									<span v-for="task in instance.tasks.slice(0, 5)">
                                        <p><b>Action</b>: {{ task.action }} | <B>Status</b>: {{ task.status }} </p>
                                        <div class="progress">
                                            <div class="progress-bar progress-bar-striped active" role="progressbar"
												 :aria-valuenow="task.progress" aria-valuemin="0" aria-valuemax="100"
												 :style="{width: task.progress+'%'}">
                                                <span class="sr-only">{{ task.progress }}% Complete</span>
                                            </div>
                                        </div>
                                    </span>
								</div>
								<div role="tabpanel" class="wow fadeIn tab-pane"
									 :class="{'active': $route.query.subtab === 'rescue'}" id="rescue">
									<h4><b>Enable Rescue Mode</b></h4>
									<p>Booting into Rescue Mode allows you to recover from kernel panic / errors and
										perform repairs on corrupted file systems.</p>
									<p>A complete Stop & Start is necessary for the instance to boot into Rescue Mode
										after being enabled.</p>

									<p v-if="instance.enabled_rescue !== 0">Password: {{ instance.rescue_password }}</p>

									<button class="btn btn-success" @click.prevent="action('enable_rescue')"
											:disabled="disableAction || instance_suspended || instance_network_suspended"
											v-if="instance.enabled_rescue === 0">Enable Rescue Mode
									</button>
									<button class="btn btn-danger" @click="action('disable_rescue')"
											:disabled="disableAction || instance_suspended || instance_network_suspended"
											v-else>Disable Rescue Mode
									</button>
									<br>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div role="tabpanel" class="wow fadeIn rseller tab-pane"
					 :class="{'active': $route.query.tab === 'resources'}" id="resources">
					<form @submit.prevent="resource_update" id="instance-update-form">
						<div class="row">
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.user_id}">
									<label> Select User</label>
									<select name="user_id" class="form-control input-lg" data-width="100%">
										<option value=""></option>
									</select>
									<span class="help-block" v-if="errors.user_id">{{ errors.user_id[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.cpu_cores}">
									<label> CPU Cores</label>
									<div class="input-group">
										<input type="number" name="cpu_cores" class="form-control input-lg"
											   v-model="instance.cpu_cores">
										<div class="input-group-addon">
											{{ reseller_limits.cpu_cores }}
										</div>
									</div>
									<span class="help-block" v-if="errors.cpu_cores">{{ errors.cpu_cores[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.ram}">
									<label> RAM (in MB)</label>
									<div class="input-group">
										<input type="number" name="ram" class="form-control input-lg"
											   v-model="instance.ram">
										<div class="input-group-addon">
											{{ reseller_limits.ram }}MB
										</div>
									</div>
									<span class="help-block" v-if="errors.ram">{{ errors.ram[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.disk_size}">
									<label> Disk (in GB)</label>
									<div class="input-group">
										<input type="number" name="disk_size" class="form-control input-lg"
											   v-model="disk_size">
										<div class="input-group-addon">
											{{ $Gb2Tb(reseller_limits.disk_size) }}
										</div>
									</div>
									<span class="help-block" v-if="errors.disk_size">{{ errors.disk_size[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.bandwidth}">
									<label> Bandwidth (in GB)</label>
									<div class="input-group">
										<input type="number" name="bandwidth" class="form-control input-lg"
											   v-model="instance.bandwidth">
										<div class="input-group-addon">
											{{ $Gb2Tb(reseller_limits.bandwidth) }}
										</div>
									</div>
									<span class="help-block" v-if="errors.bandwidth">{{ errors.bandwidth[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.ipv4_count}">
									<label> IPv4 Addresses</label>
									<div class="input-group">
										<input type="number" name="ipv4_count" class="form-control input-lg"
											   v-model="public_ipv4_list.length">
										<div class="input-group-addon">
											{{ reseller_limits.ipv4_count }}
										</div>
									</div>
									<span class="help-block" v-if="errors.ipv4_count">{{ errors.ipv4_count[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.ipv6_count}">
									<label> IPv6 Addresses</label>
									<div class="input-group">
										<input type="number" name="ipv6_count" class="form-control input-lg"
											   v-model="public_ipv6_list.length">
										<div class="input-group-addon">
											{{ reseller_limits.ipv6_count }}
										</div>
									</div>
									<span class="help-block" v-if="errors.ipv6_count">{{ errors.ipv6_count[0] }}</span>
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group" :class="{'has-error': errors.ipv6_subnet_count}">
									<label> IPv6 Subnets</label>
									<div class="input-group">
										<input type="number" name="ipv6_subnet_count" class="form-control input-lg"
											   v-model="public_ipv6_subnet_list.length">
										<div class="input-group-addon">
											{{ reseller_limits.ipv6_subnet_count }}
										</div>
									</div>
									<span class="help-block"
										  v-if="errors.ipv6_subnet_count">{{ errors.ipv6_subnet_count[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6 firewall-manage">
								<br>
								<button type="submit" class="btn btn-primary normal" :class="{disabled: processing}"
										:disabled="processing">
									<span v-if="processing"><i class="fa fa-spin fa-spinner"></i> Updating</span>
									<span v-else><i class="fa fa-edit"></i> Update</span>
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import pagination from '~/components/pagination.vue'

export default {
	layout: 'user',
	head: {
		title: 'Manage Instance'
	},
	components: {
		pagination
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
			}
		}
	},
	methods: {
		async get_instance() {
			await this.$axios.get('user/instances/' + this.$route.params.id).then((response) => {
				this.instance = response.data;
				this.update_tasks();
			}).catch((error) => {
				this.$router.push({name: 'user-dashboard'});
			});
		},
		tab(tab, subtab = '') {
			if (tab === 'settings' && subtab === '') {7
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
			let response = await this.$axios.get('user/images').catch(() => {
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
		resource_update() {
			this.$set(this, 'processing', true);
			this.$axios.patch('/user/instance/' + this.$route.params.id, $('form#instance-update-form').serialize()).then((response) => {
				this.$set(this, 'processing', false);
			}).catch(() => {
				this.$set(this, 'processing', false);
			});
		},
		update(){
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
				this.get_instance();
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
				this.get_instance();
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
				this.get_instance();
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
				this.get_instance();
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
				this.get_instance();
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
				this.get_instance();
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
				this.get_instance();
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
				this.get_instance();
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
				this.get_instance();
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
				this.get_instance();
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
