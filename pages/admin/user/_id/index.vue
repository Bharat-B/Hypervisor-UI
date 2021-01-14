<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-users" aria-hidden="true"></i> Update user</h2>
		<form @submit.prevent="update">
			<div class="col-md-6">
				<div class="box storage user">
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.role_id}">
								<label><i class="fa fa-users" aria-hidden="true"></i> Role</label>
								<select class="form-control" name="role_id" v-model="profile.role_id">
									<option value="">Select Role</option>
									<option value="1">Administrator</option>
									<option value="3">User</option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.status}">
								<label><i class="fa fa-list-ul" aria-hidden="true"></i> Status</label>
								<select class="form-control" name="status" v-model="profile.status">
									<option value="">Select Status</option>
									<option value="2">Suspended</option>
									<option value="0">Waiting verification</option>
									<option value="1">Active</option>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.first_name}">
								<label><i class="fa fa-user" aria-hidden="true"></i> First Name</label>
								<input type="text" name="first_name" class="form-control" placeholder="First Name"
									   v-model="profile.first_name">
								<span class="help-block" v-if="errors.first_name">{{ errors.first_name[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.last_name}">
								<label><i class="fa fa-user" aria-hidden="true"></i> Last Name</label>
								<input type="text" name="last_name" class="form-control" placeholder="Last Name"
									   v-model="profile.last_name">
								<span class="help-block" v-if="errors.last_name">{{ errors.last_name[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.email}">
								<label><i class="fa fa-envelope" aria-hidden="true"></i> Email address</label>
								<input type="email" name="email" class="form-control" v-model="profile.email">
								<span class="help-block" v-if="errors.email">{{ errors.email[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.timezone}">
								<label><i class="fa fa-globe" aria-hidden="true"></i> Timezone</label>
								<select class="form-control" name="timezone" data-width="100%"
										v-model="profile.timezone">
									<option value="Pacific/Midway">(GMT-11:00) Midway Island, Samoa</option>
									<option value="America/Adak">(GMT-10:00) Hawaii-Aleutian</option>
									<option value="Etc/GMT+10">(GMT-10:00) Hawaii</option>
									<option value="Pacific/Marquesas">(GMT-09:30) Marquesas Islands</option>
									<option value="Pacific/Gambier">(GMT-09:00) Gambier Islands</option>
									<option value="America/Anchorage">(GMT-09:00) Alaska</option>
									<option value="America/Ensenada">(GMT-08:00) Tijuana, Baja California</option>
									<option value="Etc/GMT+8">(GMT-08:00) Pitcairn Islands</option>
									<option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
									<option value="America/Denver">(GMT-07:00) Mountain Time (US & Canada)</option>
									<option value="America/Chihuahua">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
									<option value="America/Dawson_Creek">(GMT-07:00) Arizona</option>
									<option value="America/Belize">(GMT-06:00) Saskatchewan, Central America</option>
									<option value="America/Cancun">(GMT-06:00) Guadalajara, Mexico City, Monterrey
									</option>
									<option value="Chile/EasterIsland">(GMT-06:00) Easter Island</option>
									<option value="America/Chicago">(GMT-06:00) Central Time (US & Canada)</option>
									<option value="America/New_York">(GMT-05:00) Eastern Time (US & Canada)</option>
									<option value="America/Havana">(GMT-05:00) Cuba</option>
									<option value="America/Bogota">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
									<option value="America/Caracas">(GMT-04:30) Caracas</option>
									<option value="America/Santiago">(GMT-04:00) Santiago</option>
									<option value="America/La_Paz">(GMT-04:00) La Paz</option>
									<option value="Atlantic/Stanley">(GMT-04:00) Faukland Islands</option>
									<option value="America/Campo_Grande">(GMT-04:00) Brazil</option>
									<option value="America/Goose_Bay">(GMT-04:00) Atlantic Time (Goose Bay)</option>
									<option value="America/Glace_Bay">(GMT-04:00) Atlantic Time (Canada)</option>
									<option value="America/St_Johns">(GMT-03:30) Newfoundland</option>
									<option value="America/Araguaina">(GMT-03:00) UTC-3</option>
									<option value="America/Montevideo">(GMT-03:00) Montevideo</option>
									<option value="America/Miquelon">(GMT-03:00) Miquelon, St. Pierre</option>
									<option value="America/Godthab">(GMT-03:00) Greenland</option>
									<option value="America/Argentina/Buenos_Aires">(GMT-03:00) Buenos Aires</option>
									<option value="America/Sao_Paulo">(GMT-03:00) Brasilia</option>
									<option value="America/Noronha">(GMT-02:00) Mid-Atlantic</option>
									<option value="Atlantic/Cape_Verde">(GMT-01:00) Cape Verde Is.</option>
									<option value="Atlantic/Azores">(GMT-01:00) Azores</option>
									<option value="Europe/Belfast">(GMT) Greenwich Mean Time : Belfast</option>
									<option value="Europe/Dublin">(GMT) Greenwich Mean Time : Dublin</option>
									<option value="Europe/Lisbon">(GMT) Greenwich Mean Time : Lisbon</option>
									<option value="Europe/London">(GMT) Greenwich Mean Time : London</option>
									<option value="Africa/Abidjan">(GMT) Monrovia, Reykjavik</option>
									<option value="Europe/Amsterdam">(GMT+01:00) Amsterdam, Berlin, Bern, Rome,
										Stockholm, Vienna
									</option>
									<option value="Europe/Belgrade">(GMT+01:00) Belgrade, Bratislava, Budapest,
										Ljubljana, Prague
									</option>
									<option value="Europe/Brussels">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris
									</option>
									<option value="Africa/Algiers">(GMT+01:00) West Central Africa</option>
									<option value="Africa/Windhoek">(GMT+01:00) Windhoek</option>
									<option value="Asia/Beirut">(GMT+02:00) Beirut</option>
									<option value="Africa/Cairo">(GMT+02:00) Cairo</option>
									<option value="Asia/Gaza">(GMT+02:00) Gaza</option>
									<option value="Africa/Blantyre">(GMT+02:00) Harare, Pretoria</option>
									<option value="Asia/Jerusalem">(GMT+02:00) Jerusalem</option>
									<option value="Europe/Minsk">(GMT+02:00) Minsk</option>
									<option value="Asia/Damascus">(GMT+02:00) Syria</option>
									<option value="Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
									<option value="Africa/Addis_Ababa">(GMT+03:00) Nairobi</option>
									<option value="Asia/Tehran">(GMT+03:30) Tehran</option>
									<option value="Asia/Dubai">(GMT+04:00) Abu Dhabi, Muscat</option>
									<option value="Asia/Yerevan">(GMT+04:00) Yerevan</option>
									<option value="Asia/Kabul">(GMT+04:30) Kabul</option>
									<option value="Asia/Yekaterinburg">(GMT+05:00) Ekaterinburg</option>
									<option value="Asia/Tashkent">(GMT+05:00) Tashkent</option>
									<option value="Asia/Kolkata">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi
									</option>
									<option value="Asia/Katmandu">(GMT+05:45) Kathmandu</option>
									<option value="Asia/Dhaka">(GMT+06:00) Astana, Dhaka</option>
									<option value="Asia/Novosibirsk">(GMT+06:00) Novosibirsk</option>
									<option value="Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</option>
									<option value="Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
									<option value="Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
									<option value="Asia/Hong_Kong">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi
									</option>
									<option value="Asia/Irkutsk">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
									<option value="Australia/Perth">(GMT+08:00) Perth</option>
									<option value="Australia/Eucla">(GMT+08:45) Eucla</option>
									<option value="Asia/Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
									<option value="Asia/Seoul">(GMT+09:00) Seoul</option>
									<option value="Asia/Yakutsk">(GMT+09:00) Yakutsk</option>
									<option value="Australia/Adelaide">(GMT+09:30) Adelaide</option>
									<option value="Australia/Darwin">(GMT+09:30) Darwin</option>
									<option value="Australia/Brisbane">(GMT+10:00) Brisbane</option>
									<option value="Australia/Hobart">(GMT+10:00) Hobart</option>
									<option value="Asia/Vladivostok">(GMT+10:00) Vladivostok</option>
									<option value="Australia/Lord_Howe">(GMT+10:30) Lord Howe Island</option>
									<option value="Etc/GMT-11">(GMT+11:00) Solomon Is., New Caledonia</option>
									<option value="Asia/Magadan">(GMT+11:00) Magadan</option>
									<option value="Pacific/Norfolk">(GMT+11:30) Norfolk Island</option>
									<option value="Asia/Anadyr">(GMT+12:00) Anadyr, Kamchatka</option>
									<option value="Pacific/Auckland">(GMT+12:00) Auckland, Wellington</option>
									<option value="Etc/GMT-12">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
									<option value="Pacific/Chatham">(GMT+12:45) Chatham Islands</option>
									<option value="Pacific/Tongatapu">(GMT+13:00) Nuku'alofa</option>
									<option value="Pacific/Kiritimati">(GMT+14:00) Kiritimati</option>
								</select>
								<span class="help-block" v-if="errors.timezone">{{ errors.timezone[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<p><i class="fa fa-share" aria-hidden="true"></i> Change Password: </p>
						</div>
						<div class="col-md-6">
							<input type="hidden" name="change" value="0">
							<input type="checkbox" id="change" name="change" value="1" v-model="form.change">
							<label class="switchy" for="change"></label>
						</div>
					</div>
					<div class="row" v-if="form.change">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.password}">
								<label><i class="fa fa-unlock-alt" aria-hidden="true"></i> New Password</label>
								<input type="password" name="password" class="form-control " placeholder="Password">
								<span class="help-block" v-if="errors.password">{{ errors.password[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.password_confirmation}">
								<label><i class="fa fa-unlock-alt" aria-hidden="true"></i> Repeat Password</label>
								<input type="password" name="password_confirmation" class="form-control "
									   placeholder="Confirm Password">
								<span class="help-block"
									  v-if="errors.password_confirmation">{{ errors.password_confirmation[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.country}">
								<label class="control-label"><i class="fa fa-globe" aria-hidden="true"></i>
									Country</label>
								<div class="controls">
									<select id="country" name="country" class="choose form-control"
											v-model="profile.country">
										<option value=""></option>
									</select>
								</div>
								<span class="help-block" v-if="errors.country">{{ errors.country[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.state}">
								<label><i class="fa fa-map-marker" aria-hidden="true"></i> State</label>
								<select name="state" class="form-control" v-model="profile.state">
									<option value=""></option>
								</select>
								<span class="help-block" v-if="errors.state">{{ errors.state[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.city}">
								<label><i class="fa fa-map-marker" aria-hidden="true"></i> City / Town</label>
								<input name="city" class="form-control" type="text" placeholder="City"
									   v-model="profile.city">
								<span class="help-block" v-if="errors.city">{{ errors.city[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.address}">
								<label><i class="fa fa-map-marker" aria-hidden="true"></i> Address</label>
								<input name="address" class="form-control" type="text" placeholder="Primary Address"
									   v-model="profile.address">
								<span class="help-block" v-if="errors.address">{{ errors.address[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.phone}">
								<label><i class="fa fa-phone" aria-hidden="true"></i> Phone Number</label>
								<input type="hidden" name="country_code" v-model="profile.country_code">
								<div class="input-group input-prefix">
									<div class="input-group-addon">
										+{{ profile.country_code }}
									</div>
									<input class="form-control" name="phone" type="text" v-model="profile.phone">
								</div>
								<span class="help-block" v-if="errors.phone">{{ errors.phone[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.zipcode}">
								<label><i class="fa fa-map-marker"></i> Zipcode</label>
								<input type="text" name="zipcode" class="form-control" placeholder="Zipcode"
									   v-model="profile.zipcode">
								<span class="help-block" v-if="errors.zipcode">{{ errors.zipcode[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.instance_limit}">
								<label><i class="fa fa-unlock-alt" aria-hidden="true"></i> Instance Limit</label>
								<input type="number" name="instance_limit" class="form-control"
									   placeholder="Instance Limit" v-model="profile.instance_limit">
								<span class="help-block" v-if="errors.instance_limit">{{ errors.instance_limit[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.debit_limit}">
								<label><i class="fa fa-unlock-alt" aria-hidden="true"></i> Debit Limit</label>
								<input type="text" name="debit_limit" class="form-control" placeholder="Debit Limit"
									   v-model="profile.debit_limit">
								<span class="help-block" v-if="errors.debit_limit">{{ errors.debit_limit[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<p class="nots"><i class="fas fa-shield-alt" aria-hidden="true"></i> Enable 2FA: </p>
						</div>
						<div class="col-md-3">
							<input type="hidden" name="mfa" value="0">
							<input type="checkbox" id="switchymfa" name="mfa" value="1" :checked="profile.mfa === 1"/>
							<label class="switchy" for="switchymfa"></label>
						</div>
						<div class="col-md-3">
							<p><i class="fa fa-envelope" aria-hidden="true"></i> Enable SMTP: </p>
						</div>
						<div class="col-md-3">
							<input type="hidden" name="enable_smtp" value="0">
							<input type="checkbox" id="enable_smtp" name="enable_smtp" value="1" :checked="profile.enable_smtp === 1"/>
							<label class="switchy" for="enable_smtp"></label>
						</div>
					</div>
					<div class="row" v-show="form.mfa_opt">
						<div class="col-md-3">
							<h5><img :src="'data:image/png;base64,'+qrcode"/></h5>
						</div>
						<div class="col-md-3" v-if="form.mfa_opt && profile.mfa !== 1">
							<br/>
							<div class="form-group" :class="{'has-error': errors.test_token }">
								<label>Google Authentication</label>
								<input id="token" name="test_token" class="form-control input-lg" type="text"
									   placeholder="Enter 2FA Token">
								<span class="help-block" v-if="errors.test_token">{{ errors.test_token[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<p class="nots"> Enable Reseller</p>
						</div>
						<div class="col-md-3">
							<input type="hidden" name="is_reseller" value="0">
							<input type="checkbox" name="is_reseller" id="is_reseller" value="1" :checked="profile.is_reseller === 1">
							<label class="switchy" for="is_reseller"></label>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Image Groups</label>
								<select name="image_groups[]" class="form-control" multiple="multiple" data-width="100%">
									<option value=""></option>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>Reseller Plan</label>
								<select name="reseller_plan_id" class="form-control" data-width="100%">
									<option value=""></option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Owner</label>
								<select name="owner_id" class="form-control"></select>
							</div>
						</div>
					</div>
					<br/>
					<button class="btn btn-primary" type="submit" :disabled="processing">
						<i v-if="!processing" class="fa fa-edit" aria-hidden="true"></i>
						<i v-else class="fa fa-spin fa-spinner"></i>
						Update User
					</button>
				</div>
			</div>
			<div class="col-md-6">
				<div class="box storage user"
					 v-show="profile.reseller_plan_id === '' || profile.reseller_plan_id === 0">
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label> User Count</label>
								<input type="number" name="reseller_limits[user_count]" class="form-control"
									   v-model="profile.reseller_limits.user_count">
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label> Instance Count</label>
								<input type="number" name="reseller_limits[instance_count]" class="form-control"
									   v-model="profile.reseller_limits.instance_count">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-4">
							<div class="form-group">
								<label> CPU Cores</label>
								<input type="number" name="reseller_limits[cpu_cores]" class="form-control"
									   v-model="profile.reseller_limits.cpu_cores">
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label> CPU Units</label>
								<input type="number" name="reseller_limits[cpu_units]" class="form-control"
									   v-model="profile.reseller_limits.cpu_units">
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label> CPU Percent</label>
								<input type="number" name="reseller_limits[cpu_percent]" class="form-control"
									   v-model="profile.reseller_limits.cpu_percent">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-4">
							<div class="form-group">
								<label> RAM</label>
								<div class="input-group">
									<input type="number" name="reseller_limits[ram]" class="form-control"
										   v-model="profile.reseller_limits.ram">
									<div class="input-group-addon">
										MB
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label> Disk Storage</label>
								<div class="input-group">
									<input type="number" name="reseller_limits[disk_size]" class="form-control"
										   v-model="profile.reseller_limits.disk_size">
									<div class="input-group-addon">
										GB
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label>I/O Mode</label>
								<select name="reseller_limits[io_mode]" class="form-control" data-width="100%">
									<option value="native">Native</option>
									<option value="threads">Threads</option>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-4">
							<div class="form-group">
								<label>Total IOPS</label>
								<input type="number" name="reseller_limits[io_total]" class="form-control"
									   v-model="profile.reseller_limits.io_total">
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label>I/O Reads</label>
								<div class="input-group">
									<input type="number" name="reseller_limits[io_reads]" class="form-control"
										   v-model="profile.reseller_limits.io_reads">
									<div class="input-group-addon">
										MB/s
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label>I/O Writes</label>
								<div class="input-group">
									<input type="number" name="reseller_limits[io_writes]" class="form-control"
										   v-model="profile.reseller_limits.io_writes">
									<div class="input-group-addon">
										MB/s
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div
							:class="{'col-md-4': disk_driver === 'virtio-scsi', 'col-md-6': disk_driver !== 'virtio-scsi'}">
							<div class="form-group">
								<label> Disk Driver</label>
								<select name="reseller_limits[disk_driver]" class="form-control" data-width="100%"
										v-model="disk_driver">
									<option value="ide">IDE</option>
									<option value="virtio">Virtio</option>
									<option value="virtio-scsi">Virtio SCSI</option>
									<option value="scsi">SCSI</option>
								</select>
							</div>
						</div>
						<div
							:class="{'col-md-4': disk_driver === 'virtio-scsi', 'col-md-6': disk_driver !== 'virtio-scsi'}">
							<div class="form-group">
								<label> Disk Cache</label>
								<select name="reseller_limits[disk_cache]" class="form-control" data-width="100%">
									<option value="none">Default</option>
									<option value="writethrough">Write Through</option>
									<option value="writeback">Write Back</option>
									<option value="directsync">Direct Sync</option>
								</select>
							</div>
						</div>
						<div class="col-md-4" v-show="disk_driver === 'virtio-scsi'">
							<div class="form-group">
								<label> Disk Discard</label>
								<select name="reseller_limits[disk_discard]" class="form-control" data-width="100%">
									<option value="none">None</option>
									<option value="trim">Trim</option>
									<option value="unmap">Unmap</option>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-4">
							<div class="form-group">
								<label>IPv4</label>
								<input type="number" name="reseller_limits[ipv4_count]" class="form-control"
									   v-model="profile.reseller_limits.ipv4_count">
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label>IPv6 Addresses</label>
								<input type="number" name="reseller_limits[ipv6_count]" class="form-control"
									   v-model="profile.reseller_limits.ipv6_count">
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label>IPv6 Subnets</label>
								<input type="number" name="reseller_limits[ipv6_subnet_count]" class="form-control"
									   v-model="profile.reseller_limits.ipv6_subnet_count">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-4">
							<div class="form-group">
								<label> Bandwidth</label>
								<div class="input-group">
									<input type="number" name="reseller_limits[bandwidth]" class="form-control"
										   v-model="profile.reseller_limits.bandwidth">
									<div class="input-group-addon">
										GB
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label>Upload Speed</label>
								<div class="input-group">
									<input type="number" name="reseller_limits[upload_speed]" class="form-control"
										   v-model="profile.reseller_limits.upload_speed">
									<div class="input-group-addon">
										Mbit/s
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label>Download Speed</label>
								<div class="input-group">
									<input type="number" name="reseller_limits[download_speed]" class="form-control"
										   v-model="profile.reseller_limits.download_speed">
									<div class="input-group-addon">
										Mbit/s
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>Bandwidth Accounting</label>
								<select name="reseller_limits[bandwidth_accounting]" class="form-control"
										data-width="100%">
									<option value=""></option>
									<option value="uploads">Uploads</option>
									<option value="downloads">Downloads</option>
									<option value="both">Both</option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Overage Action</label>
								<select name="reseller_limits[bandwidth_overage]"
										class="form-control select2-hidden-accessible" data-width="100%">
									<option value=""></option>
									<option value="suspend_network">Suspend Network</option>
									<option value="suspend_instance">Suspend Instance</option>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div :class="{'col-md-4': enabledBilling, 'col-md-6': !enabledBilling}">
							<div class="form-group">
								<label>Regions</label>
								<select name="reseller_limits[regions][]" class="form-control" multiple="multiple" data-width="100%">
									<option value=""></option>
								</select>
							</div>
						</div>
						<div :class="{'col-md-4': enabledBilling, 'col-md-6': !enabledBilling}">
							<div class="form-group">
								<label>Image Groups</label>
								<select name="reseller_limits[image_groups][]" class="form-control" multiple="multiple"
										data-width="100%">
									<option value=""></option>
								</select>
							</div>
						</div>
						<div class="col-md-4" v-if="enabledBilling">
							<div class="form-group" :class="{'has-error': errors.price}">
								<label>Price</label>
								<div class="input-group">
									<div class="input-group-addon">
										{{ currencySymbol[environment.settings.currency_code] }}
									</div>
									<input type="text" name="price" class="form-control">
									<div class="input-group-addon">
										/mo
									</div>
								</div>
								<span class="help-block" v-if="errors.price">{{ errors.price[0] }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Edit User'
	},
	watch: {
		'profile.country': function (country) {
			let vm = this;
			if (country !== "") {
				let states = [], input = $('[name="state"]');
				if (states.length >= 1) {
					states = [];
				}
				this.$store.state.global.countryStates[this.profile.country].forEach((state) => {
					states.push({id: state.code, text: state.name});
				});
				if (input.hasClass('select2-hidden-accessible')) {
					input.empty().select2('destroy');
				}
				input.select2({placeholder: "Select State", data: states}).on('change', function () {
					vm.$set(vm.profile, "state", this.value);
				}).val(this.profile.state).trigger('change');
			}
		},
		'form.enable_smtp_opt': function (smtp) {
			this.$set(this.profile, "enable_smtp", smtp ? 1 : 0)
		},
		'profile.mfa': function(mfa) {
			this.$set(this.form,'mfa_opt', mfa ? 1 : 0);
		}
	},
	data() {
		return {
			reseller_plan: null,
			processing: false,
			qrcode: '',
			profile: {
				country: '',
				send_welcome: 0,
				enable_smtp: 0,
				role_id: 0,
				status: 0,
				is_reseller: 0
			},
			form: {
				change: false,
				mfa_opt: false
			},
			disk_driver: 'ide',
			reseller_regions: [],
			reseller_image_groups: [],
			image_groups: []
		}
	},
	methods: {
		update() {
			this.$set(this, "processing", true);
			this.$axios.patch('/admin/users/' + this.profile.id, $('form').serialize()).then((response) => {
				this.$set(this, "processing", false);
			}).catch((error) => {
				this.$set(this, "processing", false);
			})
		},
	},
	async asyncData({$axios, route}) {
		let response = await $axios.get('/admin/users/' + route.params.id), image_groups = [], reseller_image_groups = [], reseller_regions = [];

		if (response.data.reseller_limits.regions.length > 0) {
			response.data.reseller_limits.regions.forEach((region) => {
				reseller_regions.push({id: region.id, text: region.name, selected: true});
			})
		}

		if (response.data.reseller_limits.image_groups.length > 0) {
			response.data.reseller_limits.image_groups.forEach((image_group) => {
				reseller_image_groups.push({id: image_group.id, text: image_group.name, selected: true});
			})
		}

		if (response.data.image_groups.length > 0) {
			response.data.image_groups.forEach((image_group) => {
				image_groups.push({id: image_group.id, text: image_group.name, selected: true});
			})
		}

		return {
			profile: response.data,
			reseller_regions: reseller_regions,
			reseller_image_groups: reseller_image_groups,
			image_groups: image_groups
		}
	},
	mounted() {
		let vm = this;
		this.$axios.get('/admin/users/' + this.profile.id + '/qrcode').then((response) => {
			vm.$set(vm, "qrcode", response.data);
			vm.$set(vm.form, "mfa_opt", vm.profile.mfa === 1);
		}).catch((error) => {

		});

		$('[name="country"]').select2({
			placeholder: "Select Country",
			data: this.$store.state.global.countryList
		}).on('change', function () {
			vm.$set(vm.profile, "country", this.value);
			vm.$set(vm.profile, "country_code", vm.$store.state.global.countryPhoneList[this.value]);
		}).val(this.profile.country).trigger('change');

		$('[name="status"]').select2({placeholder: "Select Status"}).on('change', function () {
			vm.$set(vm.profile, "status", this.value)
		}).val(this.profile.status).trigger('change');

		$('[name="role_id"]').select2({placeholder: "Select Role"}).on('change', function () {
			vm.$set(vm.profile, "role_id", this.value)
		}).val(this.profile.role_id).trigger('change');

		$('[name="timezone"]').select2({placeholder: "Select Timezone"}).on('change', function () {

		}).val(this.profile.timezone).trigger('change');

		$('[name="is_reseller"]').on('change', function () {
			vm.$set(vm.profile, "is_reseller", this.value);
		})

		$('[name="reseller_limits[bandwidth_accounting]"]').select2({placeholder: 'Select Accounting'}).val(this.profile.reseller_limits.bandwidth_accounting).trigger('change');
		$('[name="reseller_limits[bandwidth_overage]"]').select2({placeholder: 'Overage Action'}).val(this.profile.reseller_limits.bandwidth_overage).trigger('change');
		$('[name="reseller_limits[disk_driver]"]').select2({placeholder: 'Select Driver'}).on('change', function () {
			vm.$set(vm, "disk_driver", this.value);
		}).val(this.profile.reseller_limits.disk_driver).trigger('change');
		$('[name="reseller_limits[disk_cache]"]').select2({placeholder: 'Select Cache'}).val(this.profile.reseller_limits.disk_cache).trigger('change');
		$('[name="reseller_limits[disk_discard]"]').select2({placeholder: 'Select Discard'}).val(this.profile.reseller_limits.disk_discard).trigger('change');

		let reseller_plan = [];
		if (this.profile.reseller_plan) {
			reseller_plan.push({
				id: this.profile.reseller_plan.id,
				text: this.profile.reseller_plan.name,
				selected: true
			})
		}

		let owner = [];

		if (this.profile.owner_id !== '' && this.profile.owner_id !== '0') {
			owner.push({
				id: this.profile.owner_id,
				text: this.profile.owner.email,
				selected: true
			})
		} else if (this.profile.owner_id === '0' || this.profile.owner_id === '') {
			owner.push({
				id: 0,
				text: 'None',
				selected: true
			})
		}

		$('[name="owner_id"]').select2({
			placeholder: 'Select Owner',
			allowClear: true,
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/users',
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
					let users = [{id: 0, text: 'None'}];
					data.data.forEach((user) => {
						if (user.id !== vm.$route.params.id) {
							users.push({id: user.id, text: user.email});
						}
					});
					return {
						results: users
					}
				},
				cache: true
			},
			data: owner
		}).on('change', function () {
			vm.$set(vm.profile, "owner_id", this.value);
		});

		$('[name="reseller_plan_id"]').select2({
			placeholder: 'Select Plan',
			allowClear: true,
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/reseller-plans',
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
					let plans = [];
					data.data.forEach((plan) => {
						plans.push({id: plan.id, text: plan.name, plan: plan});
					});
					return {
						results: plans
					}
				},
				cache: true
			},
			data: reseller_plan
		}).on('change', function () {
			vm.$set(vm.profile, "reseller_plan_id", this.value);
		});

		let states = [];
		if (states.length >= 1) {
			states = [];
		}
		if (this.profile.country) {
			this.$store.state.global.countryStates[this.profile.country].forEach((state) => {
				states.push({id: state.code, text: state.name});
			});
		}

		$('[name="state"]').select2({placeholder: "Select State", data: states}).on('change', function () {
			vm.$set(vm.profile, "state", this.value);
		}).val(this.profile.state).trigger('change');

		$('[name="reseller_limits[regions][]"]').select2({
			placeholder: 'Select Region',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/regions',
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
					let regions = [];
					data.data.forEach((region) => {
						regions.push({id: region.id, text: region.name});
					});
					return {
						results: regions
					}
				},
				cache: true
			},
			data: this.reseller_regions
		});

		$('[name="reseller_limits[image_groups][]"]').select2({
			placeholder: 'Select Groups',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/image-groups',
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
					let groups = [];
					data.data.forEach((group) => {
						groups.push({id: group.id, text: group.name});
					});
					return {
						results: groups
					}
				},
				cache: true
			},
			data: this.reseller_image_groups
		});

		$('[name="image_groups[]').select2({
			placeholder: 'Select Groups',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/image-groups',
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
					let groups = [];
					data.data.forEach((group) => {
						groups.push({id: group.id, text: group.name});
					});
					return {
						results: groups
					}
				},
				cache: true
			},
			data: this.image_groups
		});
	}
}
</script>
