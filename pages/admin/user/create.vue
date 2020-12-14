<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-users" aria-hidden="true"></i> Create user</h2>
		<div class="col-md-6">
			<div class="box storage user">
				<form @submit.prevent="create">
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.role_id}">
								<label><i class="fa fa-users" aria-hidden="true"></i> Role</label>
								<select class="choose form-control" name="role_id" v-model="form.role_id">
									<option value="">Select Role</option>
									<option value="1">Administrator</option>
									<option value="3">User</option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.status}">
								<label><i class="fa fa-list-ul" aria-hidden="true"></i> Status</label>
								<select class="choose form-control" name="status" v-model="form.status">
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
								<label><i class="fa fa-user" aria-hidden="true"></i>First Name</label>
								<input type="text" name="first_name" class="form-control" placeholder="First Name"
									   v-model="form.first_name">
								<span class="help-block" v-if="errors.first_name">{{ errors.first_name[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.last_name}">
								<label><i class="fa fa-user" aria-hidden="true"></i> Last Name</label>
								<input type="text" name="last_name" class="form-control" placeholder="Last Name"
									   v-model="form.last_name">
								<span class="help-block" v-if="errors.last_name">{{ errors.last_name[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.email}">
								<label><i class="fa fa-envelope" aria-hidden="true"></i> Email address</label>
								<input type="email" name="email" class="form-control" v-model="form.email">
								<span class="help-block" v-if="errors.email">{{ errors.email[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.timezone}">
								<label><i class="fa fa-globe" aria-hidden="true"></i> Timezone</label>
								<select class="form-control" name="timezone" data-width="100%" v-model="form.timezone">
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
							<div class="form-group" :class="{'has-error': errors.password}">
								<label><i class="fa fa-unlock-alt" aria-hidden="true"></i> New Password</label>
								<input type="password" class="form-control" name="password" placeholder="Password"
									   v-model="form.password">
								<span class="help-block" v-if="errors.password">{{ errors.password[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.password_confirmation}">
								<label><i class="fa fa-unlock-alt" aria-hidden="true"></i> Repeat Password</label>
								<input type="password" class="form-control" name="password_confirmation"
									   placeholder="Password" v-model="form.password_confirmation">
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
									<select name="country" class="form-control" v-model="form.country">
										<option value=""></option>
									</select>
								</div>
								<span class="help-block" v-if="errors.country">{{ errors.country[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.state}">
								<label><i class="fa fa-map-marker" aria-hidden="true"></i> State</label>
								<select name="state" class="form-control" v-model="form.state">
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
									   v-model="form.city">
								<span class="help-block" v-if="errors.city">{{ errors.city[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.address}">
								<label><i class="fa fa-map-marker" aria-hidden="true"></i> Address</label>
								<input name="address" class="form-control" type="text" placeholder="Primary Address"
									   v-model="form.address">
								<span class="help-block" v-if="errors.address">{{ errors.address[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.phone}">
								<label><i class="fa fa-phone" aria-hidden="true"></i> Phone Number</label>
								<div class="input-group input-prefix">
									<input type="hidden" name="country_code" v-model="form.country_code">
									<div class="input-group-addon">
										+{{ form.country_code }}
									</div>
									<input class="form-control" type="text" name="phone" v-model="form.phone">
								</div>
								<span class="help-block" v-if="errors.phone">{{ errors.phone[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.zipcode}">
								<label><i class="fa fa-map-marker"></i> Zipcode</label>
								<input type="text" name="zipcode" class="form-control" placeholder="Zipcode"
									   v-model="form.zipcode">
								<span class="help-block" v-if="errors.zipcode">{{ errors.zipcode[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.instance_limit}">
								<label><i class="fa fa-unlock-alt" aria-hidden="true"></i> Instance Limit</label>
								<input type="number" name="instance_limit" class="form-control"
									   placeholder="Instance Limit" v-model="form.instance_limit">
								<span class="help-block" v-if="errors.instance_limit">{{ errors.instance_limit[0] }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group" :class="{'has-error': errors.debit_limit}">
								<label><i class="fa fa-unlock-alt" aria-hidden="true"></i> Debit Limit</label>
								<input type="text" name="debit_limit" class="form-control" placeholder="Debit Limit"
									   v-model="form.debit_limit">
								<span class="help-block" v-if="errors.debit_limit">{{ errors.debit_limit[0] }}</span>
							</div>
						</div>
					</div>
					<br>
					<div class="row">
						<div class="col-md-6">
							<p><i class="fa fa-share" aria-hidden="true"></i> Send welcome mail: </p>
						</div>
						<div class="col-md-6">
							<input type="hidden" name="send_welcome" value="0">
							<input type="checkbox" id="send_welcome" name="send_welcome" value="1"/>
							<label class="switchy" for="send_welcome"></label>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<p><i class="fa fa-envelope" aria-hidden="true"></i> Enable SMTP: </p>
						</div>
						<div class="col-md-6">
							<input type="hidden" name="enable_smtp" value="0">
							<input type="checkbox" id="enable_smtp" name="enable_smtp" value="1"/>
							<label class="switchy" for="enable_smtp"></label>
						</div>
					</div>
					<br/>
					<button class="btn btn-primary" type="submit" :disabled="processing">
						<i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
						<i v-else class="fa fa-spin fa-spinner"></i>
						Create User
					</button>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Add User'
	},
	watch: {
		'form.country': function (country) {
			if (country !== "") {
				let states = [], input = $('[name="state"]'), vm = this;
				if (states.length >= 1) {
					states = [];
				}
				this.$store.state.global.countryStates[country].forEach((state) => {
					states.push({id: state.code, text: state.name});
				});
				if (input.hasClass('select2-hidden-accessible')) {
					input.empty().select2('destroy');
				}
				input.select2({placeholder: "Select State", data: states}).on('change', function () {
					vm.$set(vm.form, "state", this.value);
				}).val(this.state).trigger('change');
			}
		}
	},
	data() {
		return {
			processing: false,
			form: {
				first_name: '',
				last_name: '',
				phone: '',
				country: '',
				state: '',
				address: '',
				country_code: 0,
				enable_smtp: 0,
				send_welcome: 0,
				instance_limit: 0,
				debit_limit: 0.00,
				zipcode: '',
				send_welcome_opt: false,
				enable_smtp_opt: false,
				timezone: '',
				role_id: 0,
				status: 0,
			}
		}
	},
	methods: {
		create() {
			this.processing = true;
			this.$axios.post('/admin/users', $('form').serialize()).then((response) => {
				this.processing = false;
			}).catch((error) => {
				this.processing = false;
			});
		}
	},
	asyncData({$axios, route}) {

	},
	mounted() {
		let vm = this;
		$('[name="country"]').select2({
			placeholder: "Select Country",
			data: this.$store.state.global.countryList
		}).on('change', function () {
			vm.$set(vm.form, "country", this.value);
			vm.$set(vm.form, "country_code", vm.$store.state.global.countryPhoneList[this.value]);
		});
		$('[name="status"]').select2({placeholder: "Select Status"}).on('change', function () {
			vm.$set(vm.form, "status", this.value)
		});
		$('[name="role_id"]').select2({placeholder: "Select Role"}).on('change', function () {
			vm.$set(vm.form, "role_id", this.value)
		});
		$('[name="timezone"]').select2({placeholder: "Select Timezone"}).on('change', function () {
			vm.$set(vm.form, "timezone", this.value)
		});

	}
}
</script>
