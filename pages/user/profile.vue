<style>
#details .input-prefix {
	height: 20px !important;
	padding: 0px !important;
	display: block;
}

#details .input-prefix .form-control {
	width: 75%;
	float: right;
}

#details .input-prefix .input-group-addon {
	width: 25%;
	padding-top: 15px !important;
	padding-bottom: 15px !important;
	border-radius: 0px;
	float: left;
}
</style>
<template>
	<div class="dashcontent">
		<h1><i class="fa fa-user-circle" aria-hidden="true"></i> My Profile</h1>
		<p>Your account details, security and notifications.</p>
		<div class="dashstuff">
			<ul class="nav nav-tabs" role="tablist">

				<li role="presentation" class="active"><a href="#details" aria-controls="home" role="tab"
														  data-toggle="tab"><i class="fas fa-pen-square"
																			   aria-hidden="true"></i> Account
					Details</a></li>
				<li role="presentation"><a href="#api" aria-controls="home" role="tab" data-toggle="tab"><i
					class="fa fa-code" aria-hidden="true"></i> API</a></li>
				<li v-show="false" role="presentation"><a href="#notifications" aria-controls="settings" role="tab"
														  data-toggle="tab"><i class="fa fa-envelope-o"
																			   aria-hidden="true"></i> Notifications</a>
				</li>
			</ul>
			<div class="tab-content">
				<div role="tabpanel" class="wow fadeIn tab-pane active" id="details">
					<h3>Account Details</h3>
					<br/>
					<form @submit.prevent="update()" id="profile">
						<input type="hidden" name="country_code" :value="countryPhoneList[user.country]">
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.first_name }">
									<label><i class="fa fa-map-marker" aria-hidden="true"></i> First Name</label>
									<input name="first_name" class="form-control input-lg" type="text"
										   placeholder="First Name" v-model="user.first_name">
									<span class="help-block" v-if="errors.first_name">{{ errors.first_name[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.last_name}">
									<label><i class="fa fa-map-marker" aria-hidden="true"></i> Last Name</label>
									<input name="last_name" class="form-control input-lg" type="text"
										   placeholder="Last Name" v-model="user.last_name">
									<span class="help-block" v-if="errors.last_name">{{ errors.last_name[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label><i class="fa fa-envelope" aria-hidden="true"></i> Email address</label>
									<input type="hidden" name="email" :value="user.email">
									<div class="form-control-static">{{ user.email }}</div>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.phone }">
									<label><i class="fa fa-phone" aria-hidden="true"></i> Phone Number</label>
									<div class="input-group input-prefix">
										<div class="input-group-addon">
											{{ '+' + countryPhoneList[user.country] }}
										</div>
										<input class="form-control input-lg" type="number" name="phone"
											   v-model="user.phone">
									</div>
									<span class="help-block" v-if="errors.phone">{{ errors.phone[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<p class="nots"><i class="fas fa-shield-alt" aria-hidden="true"></i> Change Password:
								</p>
								<br>
							</div>
							<div class="col-md-6">
								<input type="hidden" name="change_password" value="0">
								<input type="checkbox" id="change_password" name="change_password" value="1"
									   v-model="change_password"/>
								<label class="switchy" for="change_password"></label>
								<br>
							</div>
						</div>
						<div class="row" v-if="change_password">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.password }">
									<label><i class="fa fa-unlock-alt" aria-hidden="true"></i> New Password</label>
									<input type="password" name="password" class="form-control input-lg"
										   placeholder="Password">
									<span class="help-block" v-if="errors.password">{{ errors.password[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.password_confirmation }">
									<label><i class="fa fa-unlock-alt" aria-hidden="true"></i> Repeat New
										Password</label>
									<input type="password" name="password_confirmation" class="form-control input-lg"
										   placeholder="Password">
									<span class="help-block" v-if="errors.password">{{
											errors.password_confirmation[0]
										}}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.country }">
									<label class="control-label"><i class="fa fa-globe" aria-hidden="true"></i> Country</label>
									<div class="controls">
										<select id="country" name="country" class="form-control input-lg"
												v-model="country">
											<option value=""></option>
											<option value="AF">Afghanistan</option>
											<option value="AL">Albania</option>
											<option value="DZ">Algeria</option>
											<option value="AS">American Samoa</option>
											<option value="AD">Andorra</option>
											<option value="AO">Angola</option>
											<option value="AI">Anguilla</option>
											<option value="AQ">Antarctica</option>
											<option value="AG">Antigua and Barbuda</option>
											<option value="AR">Argentina</option>
											<option value="AM">Armenia</option>
											<option value="AW">Aruba</option>
											<option value="AU">Australia</option>
											<option value="AT">Austria</option>
											<option value="AZ">Azerbaijan</option>
											<option value="BS">Bahamas</option>
											<option value="BH">Bahrain</option>
											<option value="BD">Bangladesh</option>
											<option value="BB">Barbados</option>
											<option value="BY">Belarus</option>
											<option value="BE">Belgium</option>
											<option value="BZ">Belize</option>
											<option value="BJ">Benin</option>
											<option value="BM">Bermuda</option>
											<option value="BT">Bhutan</option>
											<option value="BO">Bolivia</option>
											<option value="BA">Bosnia and Herzegowina</option>
											<option value="BW">Botswana</option>
											<option value="BV">Bouvet Island</option>
											<option value="BR">Brazil</option>
											<option value="IO">British Indian Ocean Territory</option>
											<option value="BN">Brunei Darussalam</option>
											<option value="BG">Bulgaria</option>
											<option value="BF">Burkina Faso</option>
											<option value="BI">Burundi</option>
											<option value="KH">Cambodia</option>
											<option value="CM">Cameroon</option>
											<option value="CA">Canada</option>
											<option value="CV">Cape Verde</option>
											<option value="KY">Cayman Islands</option>
											<option value="CF">Central African Republic</option>
											<option value="TD">Chad</option>
											<option value="CL">Chile</option>
											<option value="CN">China</option>
											<option value="CX">Christmas Island</option>
											<option value="CC">Cocos (Keeling) Islands</option>
											<option value="CO">Colombia</option>
											<option value="KM">Comoros</option>
											<option value="CG">Congo</option>
											<option value="CD">Congo, the Democratic Republic of the</option>
											<option value="CK">Cook Islands</option>
											<option value="CR">Costa Rica</option>
											<option value="CI">Cote d'Ivoire</option>
											<option value="HR">Croatia (Hrvatska)</option>
											<option value="CU">Cuba</option>
											<option value="CY">Cyprus</option>
											<option value="CZ">Czech Republic</option>
											<option value="DK">Denmark</option>
											<option value="DJ">Djibouti</option>
											<option value="DM">Dominica</option>
											<option value="DO">Dominican Republic</option>
											<option value="TP">East Timor</option>
											<option value="EC">Ecuador</option>
											<option value="EG">Egypt</option>
											<option value="SV">El Salvador</option>
											<option value="GQ">Equatorial Guinea</option>
											<option value="ER">Eritrea</option>
											<option value="EE">Estonia</option>
											<option value="ET">Ethiopia</option>
											<option value="FK">Falkland Islands (Malvinas)</option>
											<option value="FO">Faroe Islands</option>
											<option value="FJ">Fiji</option>
											<option value="FI">Finland</option>
											<option value="FR">France</option>
											<option value="FX">France, Metropolitan</option>
											<option value="GF">French Guiana</option>
											<option value="PF">French Polynesia</option>
											<option value="TF">French Southern Territories</option>
											<option value="GA">Gabon</option>
											<option value="GM">Gambia</option>
											<option value="GE">Georgia</option>
											<option value="DE">Germany</option>
											<option value="GH">Ghana</option>
											<option value="GI">Gibraltar</option>
											<option value="GR">Greece</option>
											<option value="GL">Greenland</option>
											<option value="GD">Grenada</option>
											<option value="GP">Guadeloupe</option>
											<option value="GU">Guam</option>
											<option value="GT">Guatemala</option>
											<option value="GN">Guinea</option>
											<option value="GW">Guinea-Bissau</option>
											<option value="GY">Guyana</option>
											<option value="HT">Haiti</option>
											<option value="HM">Heard and Mc Donald Islands</option>
											<option value="VA">Holy See (Vatican City State)</option>
											<option value="HN">Honduras</option>
											<option value="HK">Hong Kong</option>
											<option value="HU">Hungary</option>
											<option value="IS">Iceland</option>
											<option value="IN">India</option>
											<option value="ID">Indonesia</option>
											<option value="IR">Iran (Islamic Republic of)</option>
											<option value="IQ">Iraq</option>
											<option value="IE">Ireland</option>
											<option value="IL">Israel</option>
											<option value="IT">Italy</option>
											<option value="JM">Jamaica</option>
											<option value="JP">Japan</option>
											<option value="JO">Jordan</option>
											<option value="KZ">Kazakhstan</option>
											<option value="KE">Kenya</option>
											<option value="KI">Kiribati</option>
											<option value="KP">Korea, Democratic People's Republic of</option>
											<option value="KR">Korea, Republic of</option>
											<option value="KW">Kuwait</option>
											<option value="KG">Kyrgyzstan</option>
											<option value="LA">Lao People's Democratic Republic</option>
											<option value="LV">Latvia</option>
											<option value="LB">Lebanon</option>
											<option value="LS">Lesotho</option>
											<option value="LR">Liberia</option>
											<option value="LY">Libyan Arab Jamahiriya</option>
											<option value="LI">Liechtenstein</option>
											<option value="LT">Lithuania</option>
											<option value="LU">Luxembourg</option>
											<option value="MO">Macau</option>
											<option value="MK">Macedonia, The Former Yugoslav Republic of</option>
											<option value="MG">Madagascar</option>
											<option value="MW">Malawi</option>
											<option value="MY">Malaysia</option>
											<option value="MV">Maldives</option>
											<option value="ML">Mali</option>
											<option value="MT">Malta</option>
											<option value="MH">Marshall Islands</option>
											<option value="MQ">Martinique</option>
											<option value="MR">Mauritania</option>
											<option value="MU">Mauritius</option>
											<option value="YT">Mayotte</option>
											<option value="MX">Mexico</option>
											<option value="FM">Micronesia, Federated States of</option>
											<option value="MD">Moldova, Republic of</option>
											<option value="MC">Monaco</option>
											<option value="MN">Mongolia</option>
											<option value="MS">Montserrat</option>
											<option value="MA">Morocco</option>
											<option value="MZ">Mozambique</option>
											<option value="MM">Myanmar</option>
											<option value="NA">Namibia</option>
											<option value="NR">Nauru</option>
											<option value="NP">Nepal</option>
											<option value="NL">Netherlands</option>
											<option value="AN">Netherlands Antilles</option>
											<option value="NC">New Caledonia</option>
											<option value="NZ">New Zealand</option>
											<option value="NI">Nicaragua</option>
											<option value="NE">Niger</option>
											<option value="NG">Nigeria</option>
											<option value="NU">Niue</option>
											<option value="NF">Norfolk Island</option>
											<option value="MP">Northern Mariana Islands</option>
											<option value="NO">Norway</option>
											<option value="OM">Oman</option>
											<option value="PK">Pakistan</option>
											<option value="PW">Palau</option>
											<option value="PA">Panama</option>
											<option value="PG">Papua New Guinea</option>
											<option value="PY">Paraguay</option>
											<option value="PE">Peru</option>
											<option value="PH">Philippines</option>
											<option value="PN">Pitcairn</option>
											<option value="PL">Poland</option>
											<option value="PT">Portugal</option>
											<option value="PR">Puerto Rico</option>
											<option value="QA">Qatar</option>
											<option value="RE">Reunion</option>
											<option value="RO">Romania</option>
											<option value="RU">Russian Federation</option>
											<option value="RW">Rwanda</option>
											<option value="KN">Saint Kitts and Nevis</option>
											<option value="LC">Saint LUCIA</option>
											<option value="VC">Saint Vincent and the Grenadines</option>
											<option value="WS">Samoa</option>
											<option value="SM">San Marino</option>
											<option value="ST">Sao Tome and Principe</option>
											<option value="SA">Saudi Arabia</option>
											<option value="SN">Senegal</option>
											<option value="SC">Seychelles</option>
											<option value="SL">Sierra Leone</option>
											<option value="SG">Singapore</option>
											<option value="SK">Slovakia (Slovak Republic)</option>
											<option value="SI">Slovenia</option>
											<option value="SB">Solomon Islands</option>
											<option value="SO">Somalia</option>
											<option value="ZA">South Africa</option>
											<option value="GS">South Georgia and the South Sandwich Islands</option>
											<option value="ES">Spain</option>
											<option value="LK">Sri Lanka</option>
											<option value="SH">St. Helena</option>
											<option value="PM">St. Pierre and Miquelon</option>
											<option value="SD">Sudan</option>
											<option value="SR">Suriname</option>
											<option value="SJ">Svalbard and Jan Mayen Islands</option>
											<option value="SZ">Swaziland</option>
											<option value="SE">Sweden</option>
											<option value="CH">Switzerland</option>
											<option value="SY">Syrian Arab Republic</option>
											<option value="TW">Taiwan, Province of China</option>
											<option value="TJ">Tajikistan</option>
											<option value="TZ">Tanzania, United Republic of</option>
											<option value="TH">Thailand</option>
											<option value="TG">Togo</option>
											<option value="TK">Tokelau</option>
											<option value="TO">Tonga</option>
											<option value="TT">Trinidad and Tobago</option>
											<option value="TN">Tunisia</option>
											<option value="TR">Turkey</option>
											<option value="TM">Turkmenistan</option>
											<option value="TC">Turks and Caicos Islands</option>
											<option value="TV">Tuvalu</option>
											<option value="UG">Uganda</option>
											<option value="UA">Ukraine</option>
											<option value="AE">United Arab Emirates</option>
											<option value="GB">United Kingdom</option>
											<option value="US">United States</option>
											<option value="UM">United States Minor Outlying Islands</option>
											<option value="UY">Uruguay</option>
											<option value="UZ">Uzbekistan</option>
											<option value="VU">Vanuatu</option>
											<option value="VE">Venezuela</option>
											<option value="VN">Viet Nam</option>
											<option value="VG">Virgin Islands (British)</option>
											<option value="VI">Virgin Islands (U.S.)</option>
											<option value="WF">Wallis and Futuna Islands</option>
											<option value="EH">Western Sahara</option>
											<option value="YE">Yemen</option>
											<option value="YU">Yugoslavia</option>
											<option value="ZM">Zambia</option>
											<option value="ZW">Zimbabwe</option>
										</select>
									</div>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.state }">
									<label><i class="fa fa-map-marker" aria-hidden="true"></i> State</label>
									<div class="controls">
										<select name="state" id="state" data-width="100%" class="form-control input-lg"
												v-model="user.state"></select>
										<span class="help-block" v-if="errors.state">{{ errors.state[0] }}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.city }">
									<label><i class="fa fa-map-marker" aria-hidden="true"></i> City / Town</label>
									<input id="city" name="city" class="form-control input-lg" type="text"
										   placeholder="Your City" v-model="user.city">
									<span class="help-block" v-if="errors.city">{{ errors.city[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.address }">
									<label><i class="fa fa-map-marker" aria-hidden="true"></i> Address</label>
									<input name="address" class="form-control input-lg" type="text"
										   placeholder="Primary Address" v-model="user.address">
									<span class="help-block" v-if="errors.address">{{ errors.address[0] }}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.zipcode }">
									<label><i class="fa fa-map-marker" aria-hidden="true"></i> Zip Code</label>
									<input id="zipcode" name="zipcode" class="form-control input-lg" type="text"
										   placeholder="Zip Code" v-model="user.zipcode">
									<span class="help-block" v-if="errors.zipcode">{{ errors.zipcode[0] }}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group" :class="{'has-error': errors.timezone }">
									<label><i class="fa fa-map-marker" aria-hidden="true"></i> Timezone</label>
									<div class="controls">
										<select class="form-control" name="timezone" id="timezone" data-width="100%">
											<option value="Pacific/Midway">(GMT-11:00) Midway Island, Samoa</option>
											<option value="America/Adak">(GMT-10:00) Hawaii-Aleutian</option>
											<option value="Etc/GMT+10">(GMT-10:00) Hawaii</option>
											<option value="Pacific/Marquesas">(GMT-09:30) Marquesas Islands</option>
											<option value="Pacific/Gambier">(GMT-09:00) Gambier Islands</option>
											<option value="America/Anchorage">(GMT-09:00) Alaska</option>
											<option value="America/Ensenada">(GMT-08:00) Tijuana, Baja California
											</option>
											<option value="Etc/GMT+8">(GMT-08:00) Pitcairn Islands</option>
											<option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)
											</option>
											<option value="America/Denver">(GMT-07:00) Mountain Time (US & Canada)
											</option>
											<option value="America/Chihuahua">(GMT-07:00) Chihuahua, La Paz, Mazatlan
											</option>
											<option value="America/Dawson_Creek">(GMT-07:00) Arizona</option>
											<option value="America/Belize">(GMT-06:00) Saskatchewan, Central America
											</option>
											<option value="America/Cancun">(GMT-06:00) Guadalajara, Mexico City,
												Monterrey
											</option>
											<option value="Chile/EasterIsland">(GMT-06:00) Easter Island</option>
											<option value="America/Chicago">(GMT-06:00) Central Time (US & Canada)
											</option>
											<option value="America/New_York">(GMT-05:00) Eastern Time (US & Canada)
											</option>
											<option value="America/Havana">(GMT-05:00) Cuba</option>
											<option value="America/Bogota">(GMT-05:00) Bogota, Lima, Quito, Rio Branco
											</option>
											<option value="America/Caracas">(GMT-04:30) Caracas</option>
											<option value="America/Santiago">(GMT-04:00) Santiago</option>
											<option value="America/La_Paz">(GMT-04:00) La Paz</option>
											<option value="Atlantic/Stanley">(GMT-04:00) Faukland Islands</option>
											<option value="America/Campo_Grande">(GMT-04:00) Brazil</option>
											<option value="America/Goose_Bay">(GMT-04:00) Atlantic Time (Goose Bay)
											</option>
											<option value="America/Glace_Bay">(GMT-04:00) Atlantic Time (Canada)
											</option>
											<option value="America/St_Johns">(GMT-03:30) Newfoundland</option>
											<option value="America/Araguaina">(GMT-03:00) UTC-3</option>
											<option value="America/Montevideo">(GMT-03:00) Montevideo</option>
											<option value="America/Miquelon">(GMT-03:00) Miquelon, St. Pierre</option>
											<option value="America/Godthab">(GMT-03:00) Greenland</option>
											<option value="America/Argentina/Buenos_Aires">(GMT-03:00) Buenos Aires
											</option>
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
											<option value="Europe/Brussels">(GMT+01:00) Brussels, Copenhagen, Madrid,
												Paris
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
											<option value="Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg,
												Volgograd
											</option>
											<option value="Africa/Addis_Ababa">(GMT+03:00) Nairobi</option>
											<option value="Asia/Tehran">(GMT+03:30) Tehran</option>
											<option value="Asia/Dubai">(GMT+04:00) Abu Dhabi, Muscat</option>
											<option value="Asia/Yerevan">(GMT+04:00) Yerevan</option>
											<option value="Asia/Kabul">(GMT+04:30) Kabul</option>
											<option value="Asia/Yekaterinburg">(GMT+05:00) Ekaterinburg</option>
											<option value="Asia/Tashkent">(GMT+05:00) Tashkent</option>
											<option value="Asia/Kolkata">(GMT+05:30) Chennai, Kolkata, Mumbai, New
												Delhi
											</option>
											<option value="Asia/Katmandu">(GMT+05:45) Kathmandu</option>
											<option value="Asia/Dhaka">(GMT+06:00) Astana, Dhaka</option>
											<option value="Asia/Novosibirsk">(GMT+06:00) Novosibirsk</option>
											<option value="Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</option>
											<option value="Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
											<option value="Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
											<option value="Asia/Hong_Kong">(GMT+08:00) Beijing, Chongqing, Hong Kong,
												Urumqi
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
											<option value="Etc/GMT-12">(GMT+12:00) Fiji, Kamchatka, Marshall Is.
											</option>
											<option value="Pacific/Chatham">(GMT+12:45) Chatham Islands</option>
											<option value="Pacific/Tongatapu">(GMT+13:00) Nuku'alofa</option>
											<option value="Pacific/Kiritimati">(GMT+14:00) Kiritimati</option>
										</select>
										<span class="help-block" v-if="errors.timezone">{{ errors.timezone[0] }}</span>
									</div>
								</div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-6">
								<p class="nots"><i class="fas fa-shield-alt" aria-hidden="true"></i> Enable 2FA
									Security: </p>
							</div>
							<div class="col-md-6">
								<input type="hidden" name="mfa" value="0">
								<input type="checkbox" id="switchymfa" name="mfa" value="1" v-model="mfa"/>
								<label class="switchy" for="switchymfa"></label>
							</div>
						</div>
						<br/><br/>
						<div class="row" v-show="mfa || user.mfa === '1'">
							<div class="col-md-6">
								<h5><img :src="'data:image/png;base64,'+qrcode"/></h5>
							</div>
							<div class="col-md-6">
								<br/><br/><br/>
								<div class="form-group" :class="{'has-error': errors.test_token }">
									<label>Authentication Token</label>
									<input id="token" name="test_token" class="form-control input-lg" type="text"
										   placeholder="Enter 2FA Token">
									<span class="help-block" v-if="errors.test_token">{{ errors.test_token[0] }}</span>
									<button type="button" @click.prevent="refreshMFA()" class="btn btn-default"
											:class="{disabled: processing}" :disabled="processing">
										<span v-if="processing"><i class="fa fa-spin fa-spinner"></i> Refreshing</span>
										<span v-else>Refresh QR Code</span>
									</button>
								</div>
							</div>
						</div>
						<br/><br/>
						<button type="submit" class="btn btn-default" :class="{disabled: processing}"
								:disabled="processing">
							<span v-if="processing"><i class="fa fa-spin fa-spinner"></i> Updating</span>
							<span v-else>Update Account</span>
						</button>
					</form>
				</div>
				<div role="tabpanel" class="wow fadeIn tab-pane" id="api">
					<h3>API Credentials</h3>
					<br>
					<div class="table-responsive">
						<table class="table">
							<thead>
							<tr>
								<th>API KEY</th>
								<th>API PASS</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td>{{ user.api_key }}</td>
								<td>{{ user.api_pass }}</td>
							</tr>
							</tbody>
						</table>
					</div>
					<br>
					<br/><br/>
					<button type="button" @click.prevent="regenerate()" class="btn btn-default"
							:class="{disabled: processing}" :disabled="processing">
						<span v-if="processing"><i class="fa fa-spin fa-spinner"></i> Regenerating</span>
						<span v-else>Regenerate</span>
					</button>
				</div>
				<div role="tabpanel" class="wow fadeIn tab-pane" id="notifications">
					<h3>Email Notifications</h3>
					<br/>
					<div class="row">
						<div class="col-md-8">
							<p class="nots">Receive security & account news emails. </p>
						</div>
						<div class="col-md-4">
							<input type="checkbox" id="switch2"/>
							<label class="switchy" for="switch2"></label>
						</div>
					</div>
					<div class="row">
						<div class="col-md-8">
							<p class="nots">Receive promotions, news and other useful informations. </p>
						</div>
						<div class="col-md-4">
							<input type="checkbox" id="switch"/>
							<label class="switchy" for="switch"/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'user',
	head: {
		title: 'Profile'
	},
	asyncData({$axios}) {
		return $axios.get('/user/google/qrcode').then((response) => {
			return {
				qrcode: response.data
			}
		}).catch((error) => {

		});
	},
	data() {
		return {
			country: '',
			change_password: false,
			qrcode: '',
			processing: false,
			mfa: false
		}
	},
	watch: {
		"country": function (curr) {
			let states = [], input = $('#state');
			if (curr !== null && curr !== "") {
				if (states.length >= 1) {
					states = [];
				}
				this.$store.state.global.countryStates[curr].forEach((state) => {
					states.push({id: state.code, text: state.name});
				});
				if (input.hasClass('select2-hidden-accessible')) {
					input.empty().select2('destroy');
				}
				input.select2({placeholder: "Select State", data: states}).val(this.user.state).trigger('change');
			}
		}
	},
	methods: {
		async update() {
			let vm = this;
			vm.processing = true;
			await this.$axios.patch('/user', $('#profile').serialize()).catch((e) => {
			});
			vm.processing = false;
		},
		refreshMFA(){
			let vm = this;
			vm.processing = true;
			this.$axios.post('/user/mfa/refresh').then((response) => {
				vm.qrcode = response.data.qrcode;
			}).catch((e) => {

			});
			vm.processing = false;
		},
		async regenerate() {
			let vm = this;
			vm.processing = true;
			let response = await this.$axios.post('/user/generate/api').catch((e) => {
			});
			this.$store.state.auth.user = response.data.user;
			vm.processing = false;
		}
	},
	mounted() {
		let vm = this;
		new WOW().init(
			{
				boxClass: 'wow',
				animateClass: 'animated',
				offset: 0,
				mobile: false,
				live: true
			}
		);
		this.country = this.user.country;
		let country = $('#country');
		country.select2({placeholder: "Select Country"}).val(this.user.country).trigger('change').on('change', () => {
			vm.$set(vm, "country", country.val());
			vm.$set(vm.user, "country", country.val());
		});
		$('#timezone').select2({placeholder: "Select Timezone"}).val(this.user.timezone).trigger('change');
		this.$set(this, "mfa", this.user.mfa === 1);
	}
}
</script>
