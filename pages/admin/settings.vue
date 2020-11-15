<template>
	<div class="content animated fadeIn">
		<h2><i aria-hidden="true" class="fas fa-sliders-h"></i> Settings</h2>
		<div class="row">
			<div class="col-md-10 settings">
				<div class="box">
					<ul class="nav nav-tabs" role="tablist">
						<li :class="{active: $route.query.tab === 'basic'}" role="presentation"><a aria-controls="basic"
																								   data-toggle="tab"
																								   href="#basic"
																								   role="tab"
																								   @click.prevent="tab('basic')">Basic</a>
						</li>
						<li :class="{active: $route.query.tab === 'mail'}" role="presentation"><a aria-controls="mail"
																								  data-toggle="tab"
																								  href="#mail"
																								  role="tab"
																								  @click.prevent="tab('mail')">Mail</a>
						</li>
						<li :class="{active: $route.query.tab === 'billing'}" role="presentation"><a
							aria-controls="billing"
							data-toggle="tab"
							href="#billing"
							role="tab"
							@click.prevent="tab('billing')">Billing</a>
						</li>
						<li :class="{active: $route.query.tab === 'whmcs'}" role="presentation"><a aria-controls="whmcs"
																								   data-toggle="tab"
																								   href="#whmcs"
																								   role="tab"
																								   @click.prevent="tab('whmcs')">WHMCS</a>
						</li>
						<li :class="{active: $route.query.tab === 'gateway'}" role="presentation"><a
							aria-controls="gateway"
							data-toggle="tab"
							href="#gateway"
							role="tab"
							@click.prevent="tab('gateway')">Payment
							Gateway</a></li>
						<li :class="{active: $route.query.tab === 'users'}" role="presentation"><a aria-controls="users"
																								   data-toggle="tab"
																								   href="#users"
																								   role="tab"
																								   @click.prevent="tab('users')">Users</a>
						</li>
						<li :class="{active: $route.query.tab === 'system'}" role="presentation"><a
							aria-controls="system"
							data-toggle="tab"
							href="#system"
							role="tab"
							@click.prevent="tab('system')">System</a>
						</li>
						<li :class="{active: $route.query.tab === 'api'}" role="presentation"><a aria-controls="api"
																								 data-toggle="tab"
																								 href="#api"
																								 role="tab"
																								 @click.prevent="tab('api')">API</a>
						</li>
					</ul>
					<form @submit.prevent="update">
						<div class="tab-content">
							<div id="basic" :class="{active: $route.query.tab === 'basic'}" class="tab-pane"
								 role="tabpanel">
								<div class="row">
									<div class="col-md-3">
										<h5>Master Domain:</h5> <input v-model="panel_settings.master_domain"
																	   class="form-control"
																	   name="master_domain"
																	   type="text">
									</div>
									<div class="col-md-3">
										<h5>Company Domain:</h5> <input v-model="panel_settings.company_domain"
																		class="form-control"
																		name="company_domain"
																		type="text">
									</div>
								</div>
								<div class="row">
									<div class="col-md-3">
										<h5>Company Logo:</h5> <input v-model="panel_settings.company_logo"
																	  class="form-control"
																	  name="company_logo"
																	  type="text">
									</div>
									<div class="col-md-3">
										<h5>Support Url:</h5> <input v-model="panel_settings.support_url"
																	 class="form-control" name="support_url"
																	 type="text">
									</div>
								</div>
							</div>
							<div id="mail" :class="{active: $route.query.tab === 'mail'}" class="tab-pane"
								 role="tabpanel">
								<div class="row">
									<div class='col-md-3'>
										<h5>Enable SMTP:</h5>
										<input name="enable_smtp" type="hidden" value="0"/>
										<input id="enable_smtp" :checked="panel_settings.enable_smtp === '1'"
											   name="enable_smtp" type="checkbox"
											   value="1"/>
										<label class="switchy" for="enable_smtp"></label>
									</div>
								</div>
								<div class="row">
									<div class='col-md-3'>
										<h5>SMTP Provider:</h5>
										<select v-model="panel_settings.smtp_mailer" class="form-control" name="smtp_mailer">
											<option value="smtp">SMTP</option>
											<option value="ses">AWS SES</option>
										</select>
									</div>
									<div class="row">
										<div class="col-md-3">
											<h5>From Email: </h5> <input v-model="panel_settings.system_emails_from" class="form-control" name="system_emails_from" type="text">
										</div>
									</div>
								</div>
								<div class="row">
									<div class='col-md-3'>
										<h5>SMTP Server:</h5>
										<input v-model="panel_settings.smtp_hostname" class="form-control" name="smtp_hostname" type="text">
									</div>
									<div class='col-md-3'>
										<h5>SMTP Port:</h5>
										<input v-model="panel_settings.smtp_port" class="form-control" name="smtp_port" type="text">
									</div>
								</div>
								<div class="row">
									<div class='col-md-3'>
										<h5>SMTP Username:</h5>
										<input v-model="panel_settings.smtp_username" class="form-control" name="smtp_username" type="text">
									</div>
									<div class='col-md-3'>
										<h5>SMTP Password:</h5>
										<input v-model="panel_settings.smtp_password" class="form-control" name="smtp_password" type="password">
									</div>
								</div>
								<div class="row">
									<div class='col-md-3'>
										<h5>SMTP Protocol:</h5>
										<select v-model="panel_settings.smtp_protocol" class="form-control"
												name="smtp_protocol">
											<option value="none">None</option>
											<option value="ssl">SSL</option>
											<option value="tls">TLS</option>
										</select>
									</div>
									<div class="col-md-3">
										<h5>SMTP Region ( AWS SES ):</h5>
										<input v-model="panel_settings.smtp_region" class="form-control" name="smtp_region" type="text" placeholder="us-east-1">
									</div>
								</div>
							</div>
							<div id="billing" :class="{active: $route.query.tab === 'billing'}" class="tab-pane"
								 role="tabpanel">
								<div class="row">
									<div class="col-md-3">
										<h5>Enable Billing:</h5>
										<input name="enable_billing" type="hidden" value="0">
										<input id="enable_billing" :checked="panel_settings.enable_billing == '1'"
											   name="enable_billing" type="checkbox"
											   value="1"/>
										<label class="switchy" for="enable_billing"></label>
									</div>
									<div class="col-md-3">
										<h5>Billing Scope: </h5>
										<select class="form-control" data-width="100%" name="billing_type">
											<option value="inhouse">Panel</option>
											<!--<option value="whmcs">WHMCS</option>-->
										</select>
									</div>
								</div>
								<div class="row">
									<div class="col-md-3">
										<h5>Company Name: </h5>
										<input v-model="panel_settings.company_name" class="form-control"
											   name="company_name"
											   placeholder="Company Name" type="text">
									</div>
									<div class="col-md-3">
										<h5>Address:</h5>
										<input v-model="panel_settings.address" class="form-control" name="address"
											   placeholder="Address"
											   type="text">
									</div>
								</div>
								<div class="row">
									<div class="col-md-3">
										<h5>Country: </h5>
										<select class="form-control" data-width="100%" name="country">
											<option value=""></option>
										</select>
									</div>
									<div class="col-md-3">
										<h5>State:</h5>
										<select class="form-control" data-width="100%" name="state">
											<option value=""></option>
										</select>
									</div>
								</div>
								<div class="row">
									<div class="col-md-3">
										<h5>City:</h5>
										<input v-model="panel_settings.city" class="form-control" name="city"
											   placeholder="City"
											   type="text">
									</div>
									<div class="col-md-3">
										<h5>Zip Code: </h5> <input v-model="panel_settings.zipcode" class="form-control"
																   name="zipcode"
																   type="text">
									</div>
								</div>
								<div class="row">
									<div class="col-md-3">
										<h5>Phone: </h5> <input v-model="panel_settings.phone" class="form-control"
																name="phone"
																type="text">
									</div>
									<div class="col-md-3">
										<h5>Tax ID: </h5>
										<input v-model="panel_settings.tax_id" class="form-control" name="tax_id"
											   type="text">
									</div>
								</div>
								<div class="row">
									<div class="col-md-3">
										<h5>Currency: </h5>
										<select class="form-control" data-width="100%" name="currency_code">
										</select>
									</div>
									<div class="col-md-3">
										<h5>Currency Format: </h5>
										<select class="choose form-control" data-width="100%" name="currency_format">
											<option value="1">9999.99</option>
											<option value="2">9,999.99</option>
											<option value="3">9.999,99</option>
											<option value="4">9,999</option>
										</select>
									</div>
								</div>
								<br/>
								<hr>
								<div class="row">
									<div class="col-md-11">
										<h5>Enable Taxes:</h5>
										<input name="enable_tax" type="hidden" value="0">
										<input id="enable_tax" :checked="panel_settings.enable_tax == '1'"
											   name="enable_tax" type="checkbox"
											   value="1"/>
										<label class="switchy" for="enable_tax"></label>
									</div>
								</div>
								<div class="row">
									<div class="col-md-3">
										<h5>Level 1 ( Name ): </h5>
										<input v-model="panel_settings.tax_name1" class="form-control" name="tax_name1"
											   type="text">
									</div>
									<div class="col-md-3">
										<h5>Level 1 ( Percentage ): </h5>
										<input v-model="panel_settings.tax_value1" class="form-control"
											   name="tax_value1" placeholder="0"
											   type="number">
									</div>
								</div>
								<div class="row">
									<div class="col-md-3">
										<h5>Level 2 ( Name ): </h5> <input v-model="panel_settings.tax_name2"
																		   class="form-control"
																		   name="tax_name2"
																		   type="text">
									</div>
									<div class="col-md-3">
										<h5>Level 2 ( Percentage ):: </h5> <input v-model="panel_settings.tax_value2"
																				  class="form-control"
																				  name="tax_value2" placeholder="0"
																				  type="number">
									</div>
								</div>
								<div class="row">
									<div class="col-md-3">
										<h5>Applicable Countries: </h5>
										<select class="form-control" data-width="100%" multiple="multiple"
												name="tax_countries[]">
										</select>
									</div>
									<div class="col-md-3 sc">
										<h5>Applicable States: </h5>
										<select class="form-control" data-width="100%" multiple="multiple"
												name="tax_states[]">
										</select>
									</div>
								</div>
							</div>
							<div id="whmcs" :class="{active: $route.query.tab === 'whmcs'}" class="tab-pane"
								 role="tabpanel">
								<div class="row">
									<div class="col-md-3">
										<h5>WHMCS URL: </h5>
										<input v-model="panel_settings.whmcs_api_url" class="form-control"
											   name="whmcs_api_url"
											   placeholder="WHMCS URL" type="text">
									</div>
								</div>
								<div class="row">
									<div class="col-md-3">
										<h5>WHMCS API Identifier: </h5>
										<input v-model="panel_settings.whmcs_api_key" class="form-control"
											   name="whmcs_api_key"
											   placeholder="Identifier" type="text">
									</div>
									<div class="col-md-3">
										<h5>WHMCS API Secret:</h5>
										<input v-model="panel_settings.whmcs_api_secret" class="form-control"
											   name="whmcs_api_secret"
											   placeholder="Secret" type="text">
									</div>
								</div>
							</div>
							<div id="gateway" :class="{active: $route.query.tab === 'gateway'}" class="tab-pane"
								 role="tabpanel">
								<div class="row instance">
									<div class="panel panel-default">
										<a aria-controls="paypalCollapse" aria-expanded="true" data-parent="#accordion"
										   data-toggle="collapse" href="#paypalCollapse" role="button">
											<div id="paypal" class="panel-heading" role="tab">
												<h4 class="panel-title name">
													<i class="fab fa-cc-paypal"></i>&nbsp; PayPal
													<div class="options">
														<div
															:class="{ on: panel_settings.enable_paypal === '1', off: panel_settings.enable_paypal !== '1'}"
															class="status">
														</div>
													</div>
												</h4>
											</div>
										</a>
										<div id="paypalCollapse" aria-labelledby="paypal"
											 class="panel-collapse collapse"
											 role="tabpanel">
											<div class="panel-body">
												<div class="col-md-3">
													<img src="/assets/paypal.png"/>
													<h5>Enable:</h5>
													<input name="enable_paypal" type="hidden" value="0">
													<input id="enable_paypal"
														   :checked="panel_settings.enable_paypal === '1'"
														   name="enable_paypal"
														   type="checkbox"
														   value="1"/>
													<label class="switchy" for="enable_paypal"></label>
												</div>
												<div class="col-md-4">
													<h5>Client ID: </h5> <input
													v-model="panel_settings.paypal_client_id" class="form-control"
													name="paypal_client_id"
													placeholder="Paypal Client ID"
													type="text">
													<h5>Secret ID: </h5> <input
													v-model="panel_settings.paypal_secret_id" class="form-control"
													name="paypal_secret_id"
													placeholder="Paypal Secret ID"
													type="text">
													<h5>API Username: </h5> <input
													v-model="panel_settings.paypal_api_user" class="form-control"
													name="paypal_api_user"
													placeholder="User"
													type="text">
													<h5>API Password: </h5> <input
													v-model="panel_settings.paypal_api_password" class="form-control"
													name="paypal_api_password"
													placeholder="Password"
													type="password">
													<h5>API Signature: </h5> <input
													v-model="panel_settings.paypal_api_signature" class="form-control"
													name="paypal_api_signature"
													placeholder="Signature"
													type="password">
												</div>
											</div>
										</div>
									</div>
									<div class="panel panel-default">
										<a aria-controls="razorpayCollapse" aria-expanded="true"
										   data-parent="#accordion"
										   data-toggle="collapse" href="#razorpayCollapse"
										   role="button">
											<div id="razorpay" class="panel-heading" role="tab">
												<h4 class="panel-title name">
													<i class="far fa-credit-card"></i>&nbsp; Razorpay
													<div class="options">
														<div
															:class="{ on: panel_settings.enable_razorpay === '1', off: panel_settings.enable_razorpay !== '1'}"
															class="status">
														</div>
													</div>
												</h4>
											</div>
										</a>
										<div id="razorpayCollapse" aria-labelledby="razorpay"
											 class="panel-collapse collapse"
											 role="tabpanel">
											<div class="panel-body">
												<div class="col-md-3">
													<img src="/assets/razor.png"/>
													<h5>Enable:</h5>
													<input name="enable_razorpay" type="hidden" value="0">
													<input id="enable_razorpay"
														   :checked="panel_settings.enable_razorpay === '1'"
														   name="enable_razorpay"
														   type="checkbox"
														   value="1"/>
													<label class="switchy" for="enable_razorpay"></label>
												</div>
												<div class="col-md-6">
													<h5>API Key: </h5> <input v-model="panel_settings.razorpay_publish"
																			  class="form-control"
																			  name="razorpay_publish"
																			  placeholder="API Key"
																			  type="text">
													<h5>API Secret: </h5> <input v-model="panel_settings.razorpay_key"
																				 class="form-control"
																				 name="razorpay_key"
																				 placeholder="API Secret"
																				 type="text">
												</div>
											</div>
										</div>
									</div>
									<div class="panel panel-default">
										<a aria-controls="stripeCollapse" aria-expanded="true" data-parent="#accordion"
										   data-toggle="collapse" href="#stripeCollapse" role="button">
											<div id="stripe" class="panel-heading" role="tab">
												<h4 class="panel-title name">
													<i class="fab fa-cc-stripe"></i>&nbsp; Stripe
													<div class="options">
														<div
															:class="{ on: panel_settings.enable_stripe === '1', off: panel_settings.enable_stripe !== '1'}"
															class="status">
														</div>
													</div>
												</h4>
											</div>
										</a>
										<div id="stripeCollapse" aria-labelledby="stripe"
											 class="panel-collapse collapse"
											 role="tabpanel">
											<div class="panel-body">
												<div class="col-md-3">
													<img src="/assets/stripe.png"/>
													<h5>Enable:</h5>
													<input name="enable_stripe" type="hidden" value="0">
													<input id="enable_stripe"
														   :checked="panel_settings.enable_stripe === '1'"
														   name="enable_stripe"
														   type="checkbox"
														   value="1"/>
													<label class="switchy" for="enable_stripe"></label>
												</div>
												<div class="col-md-6">
													<h5>Public Key: </h5> <input v-model="panel_settings.stripe_publish"
																				 class="form-control"
																				 name="stripe_publish"
																				 placeholder="Public Key"
																				 type="text">
													<h5>Secret Key: </h5> <input v-model="panel_settings.stripe_secret"
																				 class="form-control"
																				 name="stripe_secret"
																				 placeholder="Secret Key"
																				 type="text">
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="users" :class="{active: $route.query.tab === 'users'}" class="tab-pane"
								 role="tabpanel">
								<div class="row">
									<div class="col-md-3">
										<h5>Enable SMTP Port:</h5>
										<div class="from-group">
											<input name="instance_enable_smtp" type="hidden" value="0"/>
											<input id="instance_enable_smtp"
												   :checked="panel_settings.instance_enable_smtp === '1'"
												   name="instance_enable_smtp"
												   type="checkbox" value="1"/>
											<label class="switchy" for="instance_enable_smtp"></label>
										</div>
										<h5>User Debit Limit: </h5>
										<div class="form-group">
											<label class="sr-only">Amount</label>
											<div class="input-group">
												<div class="input-group-addon">
													{{ currencySymbol[panel_settings.currency_code] }}
												</div>
												<input v-model="panel_settings.default_debit_limit" class="form-control"
													   name="default_debit_limit"
													   placeholder="Amount"
													   type="text">
											</div>
										</div>
										<h5>Minimum Add funds: </h5>
										<div class="form-group">
											<label class="sr-only">Amount</label>
											<div class="input-group">
												<div class="input-group-addon">
													{{ currencySymbol[panel_settings.currency_code] }}
												</div>
												<input v-model="panel_settings.minimum_add_funds" class="form-control"
													   name="minimum_add_funds"
													   placeholder="Amount" type="text">
											</div>
										</div>
										<h5>User Instance Limit: </h5> <input
										v-model="panel_settings.default_instance_limit"
										class="form-control"
										name="default_instance_limit"
										type="number">
									</div>
								</div>
							</div>
							<div id="system" :class="{active: $route.query.tab === 'system'}" class="tab-pane"
								 role="tabpanel">
								<div class="row">
									<div class="col-md-3">
										<h5>Maintainence:</h5>
										<input name="maintainence" type="hidden" value="0"/>
										<input id="maintainence" :checked="panel_settings.maintainence === '1'" name="maintainence" type="checkbox" value="1"/>
										<label class="switchy" for="maintainence"></label>
									</div>
									<div class="col-md-3">
										<h5>Enable Database Backups:</h5>
										<input name="database_backups" type="hidden" value="0">
										<input id="database_backups" :checked="panel_settings.database_backups === '1'"
											   name="database_backups" type="checkbox"
											   value="1"/>
										<label class="switchy" for="database_backups"></label>
									</div>
								</div>

								<div class="row">
									<div class="col-md-3">
										<a class="btn btn-default" target="_blank" href="/phpmyadmin/">Manage Database</a>
										<p>Check the .env file present in /usr/local/hypervisor for password</p>
									</div>
								</div>
							</div>
							<div id="api" :class="{active: $route.query.tab === 'api'}" class="tab-pane"
								 role="tabpanel">
								<div class="row">
									<div class="col-md-3">
										<h5>API Key: </h5>
										<p>{{ panel_settings.api_key }}</p>
										<h5>API Pass: </h5>
										<p>{{ panel_settings.api_pass }}</p>
										<h5>API Whitelist IP(s): </h5>
										<select class="form-control select2-hidden-accessible" data-width="100%"
												multiple="multiple" name="api_whitelist_ips[]"></select>
									</div>
								</div>
							</div>
						</div>
						<button class="btn btn-lg btn-primary" type="submit"><i class="fa fa-edit"></i> Update</button>
					</form>
				</div>
			</div>
			<!-- End of row -->
		</div>
		<!-- End of Content -->
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Settings'
	},
	data() {
		return {
			panel_settings: {}
		}
	},
	methods: {
		tab(tab) {
			if (tab === 'basic') {
				if (this.$route.query.tab !== tab) {
					this.$router.replace({name: this.$route.name, query: {tab: tab}});
				}
			} else {
				if (this.$route.query.tab !== tab) {
					this.$router.replace({name: this.$route.name, query: {tab: tab}});
				}
			}
		},
		async update() {
			this.processing = true;
			let response = await this.$axios.patch('/admin/settings', $('form').serialize()).catch((error) => {
				this.processing = false;
			});
			if (response) {
				this.$set(this, "panel_settings", response.data.settings);
			}
			this.processing = false;
		},
		setState() {
			let vm = this, states = [], input = $('[name="state"]');
			if (this.panel_settings.country !== "" && this.panel_settings.country !== null) {
				if (states.length >= 1) {
					states = [];
				}
				vm.$store.getters.countryStates[this.panel_settings.country].forEach((state) => {
					states.push({
						id: state.code,
						text: state.name,
						selected: vm.$store.getters.settings.state === state.code
					});
				});
				if (input.hasClass('select2-hidden-accessible')) {
					input.empty().select2('destroy');
				}
				input.select2({
					placeholder: "Select State",
					data: states
				}).val(vm.$store.getters.settings.state).trigger('change');
			}
		},
		setStates() {
			let vm = this, states = [], input = $('[name="tax_states[]"]'), countries = [];
			vm.$set(vm.panel_settings, "tax_countries", vm.panel_settings.tax_countries.toString().split(','));
			if ($.isArray(this.panel_settings.tax_countries) && this.panel_settings.tax_countries.length >= 1) {
				if (states.length >= 1) {
					states = [];
				}
				let selected = vm.panel_settings.tax_states.toString().split(',')
				this.panel_settings.tax_countries.forEach((country) => {
					if (vm.$store.getters.countryStates[country]) {
						vm.$store.getters.countryStates[country].forEach((state) => {
							states.push({
								id: state.code,
								text: state.name,
								selected: selected.indexOf(state.code) !== -1
							});
						});
					}
				});
				if (input.hasClass('select2-hidden-accessible')) {
					input.empty().select2('destroy');
				}
				input.select2({placeholder: "Select State", data: states}).trigger('change');
			} else {
				if (input.hasClass('select2-hidden-accessible')) {
					input.empty().select2('destroy');
				}
				input.select2({placeholder: "Select State", data: []}).trigger('change');
			}
		}
	},
	watch: {
		"panel_settings.tax_countries": function (curr) {
			let vm = this, states = [], input = $('[name="tax_states[]"]');
			if (curr !== "" && curr !== null) {
				if (states.length >= 1) {
					states = [];
				}
				if (!$.isArray(curr)) {
					curr = curr.toString().split(',');
				}
				let selected = vm.panel_settings.tax_states.toString().split(',');
				curr.forEach((country) => {
					if (vm.$store.getters.countryStates[country]) {
						vm.$store.getters.countryStates[country].forEach((state) => {
							states.push({
								id: state.code,
								text: state.name,
								selected: selected.indexOf(state.code) !== -1
							});
						});
					}
				});

				input.select2({placeholder: "Select States", data: states}).val(selected).trigger('change');
			}

		},
		"panel_settings.country": function (curr) {
			let vm = this, states = [], input = $('[name="state"]');
			if (curr !== "" && curr !== null) {
				if (states.length >= 1) {
					states = [];
				}
				vm.$store.getters.countryStates[curr].forEach((state) => {
					states.push({
						id: state.code,
						text: state.name,
						selected: vm.$store.getters.settings.state === state.code
					});
				});
				if (input.hasClass('select2-hidden-accessible')) {
					input.empty().select2('destroy');
				}
				input.select2({placeholder: "Select State", data: states}).trigger('change');
			}
		}
	},
	asyncData({$axios, route}) {
		return $axios.get('/admin/settings').then((response) => {
			return {
				panel_settings: response.data
			}
		}).catch((error) => {

		})
	},
	mounted() {
		let vm = this;
		let selected_countries = vm.panel_settings.tax_countries.toString().split(',');
		if (this.$route.query.tab) {
			let tab = this.$route.query.tab;
			vm.tab(tab);
		} else {
			vm.tab('basic');
		}
		$('[name="currency_code"]').select2({
			placeholder: "Select Currency",
			data: this.$store.getters.currencyList
		}).val(this.$store.getters.settings.currency_code).trigger('change');
		$('[name="currency_format"]').select2({placeholder: "Select Currency Format"}).val(this.$store.getters.settings.currency_format).trigger('change');

		$('[name="country"]').select2({
			placeholder: "Select Country",
			data: this.$store.getters.countryList
		}).on('change', function () {
			vm.$set(vm.panel_settings, "country", this.value);
		}).val(vm.panel_settings.country).trigger('change');

		$('[name="state"]').select2({
			placeholder: "Select State",
			data: []
		}).val(this.$store.getters.settings.state).on('change', function () {
			vm.$set(vm.panel_settings, "state", this.value);
		}).trigger('change');

		$('[name="billing_type"]').select2({placeholder: "Select Billing"}).val(this.$store.getters.settings.billing_type).on('change', function () {
			vm.$set(vm.panel_settings, "billing_type", this.value);
		}).trigger('change');

		$('[name="tax_countries[]"]').select2({
			placeholder: "Select Country",
			data: this.$store.getters.countryList
		}).val(selected_countries).on('change', function () {
			vm.$set(vm.panel_settings, "tax_countries", $('[name="tax_countries[]"]').val());
		}).trigger('change');

		this.setState();
		this.setStates();

		let white_ips = [];
		let ips = vm.panel_settings.api_whitelist_ips.toString().split(',');
		ips.forEach((ip) => {
			white_ips.push({id: ip, text: ip, selected: true});
		});

		$('[name="api_whitelist_ips[]"]').select2({
			placeholder: "Provide IP(s) separated by comma",
			tags: true,
			tokenSeparators: [','],
			data: white_ips
		});

	}
}
</script>
<style>
.instance .options .status {
	margin-top: 0px !important;
}
</style>
