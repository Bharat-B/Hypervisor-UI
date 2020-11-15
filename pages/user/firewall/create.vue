<template>
	<div class="dashcontent">
		<h1><i class="fa fa-wrench" aria-hidden="true"></i> Create Firewall</h1>
		<div class="dashstuff">
			<div class="col-md-11">
				<div class="wow fadeIn blocks firewall-manage">
					<div class="row">
						<p class="mobile-view">You cannot edit a firewall from a mobile device, please make your changes
							from a bigger device.</p>
						<div class="col-md-12">
							<form name="firewall-form" @submit.prevent="create">
								<div class="row">
									<div class="col-md-6">
										<h3>Firewall</h3>
										<div class="form-group" :class="{'has-error': errors.name }">
											<input style="min-width: 69% !important;" class="form-control nameit"
												   name="name" placeholder="Firewall Name">
											<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
										</div>
									</div>
									<div class="col-md-6">
										<h3>Apply to instance</h3>
										<select style="padding: 25px !important; min-width: 350px !important;" multiple
												class="form-control" name="instances[]"></select>
									</div>
								</div>
								<h4>Inbound Rules</h4>
								<p>Set the incoming rules for incoming traffic that will be used on this firewall.</p>
								<div class="table-responsive">
									<table class="table">
										<thead>
										<tr>
											<th>Type</th>
											<th>Protocol</th>
											<th>Port Range</th>
											<th>Source IP(s)</th>
											<th>Comment</th>
											<th></th>
										</tr>
										</thead>
										<tbody>
										<firewall-rule v-for="$rule in rulearr" v-bind:rule="$rule"
													   v-bind:firewall="firewall" v-bind:id="'rule-'+$rule"
													   v-on:removerule="removeRule" :key="$rule"></firewall-rule>
										<tr>
											<td>
												<button class="btn btn-primary btn-block" @click.prevent="addRule">Add
													New Rule
												</button>
											</td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
										</tbody>
									</table>
								</div>
								<br><br>
								<button type="submit" class="btn btn-primary" :class="{disabled: processing}"
										:disabled="processing">
									<span v-if="processing"><i class="fa fa-spin fa-spinner"></i> Creating</span>
									<span v-else>Create</span>
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import FirewallRule from "../../../components/firewall/firewall-rule";

export default {
	layout: 'user',
	components: {
		FirewallRule
	},
	head: {
		title: 'Create Firewall',
	},
	data() {
		return {
			processing: false,
			rulecount: 0,
			rulearr: [],
			firewall: {
				rules: []
			},
			instances: []
		}
	},

	methods: {
		async create() {
			let vm = this;
			vm.processing = true;
			await this.$axios.post('user/firewall', $('form[name="firewall-form"]').serialize()).catch((e) => {
			});
			vm.processing = false;
		},
		addRule() {
			let vm = this, ports = {tcp: [], udp: []};
			vm.rulearr.push(this.rulecount);
			vm.rulecount++;
			for (let i = 0; i < vm.firewall.rules.length; i++) {
				if (vm.firewall.rules[i].type === 'custom') {
					if (vm.firewall.rules[i].protocol === 'tcp') {
						if ($.inArray(vm.firewall.rules[i].ports, ports['tcp']) !== -1) {
							vm.$set(vm.firewall.rules[i], 'error_port', true);
						} else {
							vm.$set(vm.firewall.rules[i], 'error_port', false);
						}
					} else if (vm.firewall.rules[i].protocol === 'udp') {
						if ($.inArray(vm.firewall.rules[i].ports, ports['udp']) !== -1) {
							vm.$set(vm.firewall.rules[i], 'error_port', true);
						} else {
							vm.$set(vm.firewall.rules[i], 'error_port', false);
						}
					}
					if (vm.firewall.rules[i].ports !== "") {
						ports[vm.firewall.rules[i].protocol].push(vm.firewall.rules[i].ports);
					}
				}
			}
		},
		removeRule(i) {
			$('#rule-' + i).remove();
		},
	},
	mounted() {
		let vm = this;
		this.addRule();
		$('[name="instances[]"]').select2({
			placeholder: 'Select Instance',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/user/instances',
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
					let instances = [];
					data.data.forEach((instance) => {
						let ips = 0;
						instances.push({id: instance.id, text: instance.hostname});
					});
					return {
						results: instances
					}
				},
				cache: true
			},
		});
	}
}
</script>
