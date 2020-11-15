<template>
	<div class="content animated fadeIn">
		<h2><i class="fab fa-linux" aria-hidden="true"></i> Add image</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="add">
					<div class="form-group row" :class="{'has-error': errors.name}">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="name" class="form-control">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="form-group row" :class="{'has-error': errors.user_id}">
						<div class="col-md-2">
							<h5>User:</h5>
						</div>
						<div class="col-md-3">
							<select name="user_id" class="form-control">
								<option value=""></option>
							</select>
							<span class="help-block" v-if="errors.user_id">{{ errors.user_id[0] }}</span>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-2">
							<h5>From:</h5>
						</div>
						<div class="col-md-3">
							<select name="from" class="form-control">
								<option value="default">URL</option>
								<option value="hypervisor">Hypervisor</option>
							</select>
						</div>
					</div>

					<div class="form-group row" :class="{'has-error': errors.url}" v-if="from === 'default'">
						<div class="col-md-2">
							<h5>URL</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="url" class="form-control" placeholder="http://url/to/image.img">
							<span class="help-block" v-if="errors.url">{{ errors.url[0] }}</span>
						</div>
					</div>

					<div class="form-group row" :class="{'has-error': errors.hypervisor_id}"
						 v-show="from === 'hypervisor'">
						<div class="col-md-2">
							<h5>Hypervisor:</h5>
						</div>
						<div class="col-md-3">
							<select name="hypervisor_id" class="form-control" data-width="100%">
								<option value=""></option>
							</select>
							<span class="help-block" v-if="errors.hypervisor_id">{{ errors.hypervisor_id[0] }}</span>
						</div>
					</div>

					<div class="form-group row" :class="{'has-error': errors.path}" v-if="from === 'hypervisor'">
						<div class="col-md-2">
							<h5>Path:</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="location" class="form-control" placeholder="/root/test.img">
							<span class="help-block" v-if="errors.path">{{ errors.path[0] }}</span>
						</div>
					</div>

					<div class="form-group row">
						<div class="col-md-2">
							<h5>Distro:</h5>
						</div>
						<div class="col-md-3">
							<select name="distro" class="form-control">
								<option value=""></option>
							</select>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-2">
							<h5>Perform Operations:</h5>
						</div>
						<div class="col-md-3">
							<input type="checkbox" name="modify" value="0"/>
							<input type="checkbox" name="modify" id="modify" value="1"/>
							<label class="switchy" for="modify"/>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-2">
							<h5>Private Image:</h5>
						</div>
						<div class="col-md-3">
							<input type="checkbox" name="type" value="public"/>
							<input type="checkbox" name="type" id="private" value="private"/>
							<label class="switchy" for="private"/>
						</div>
					</div>
					<br/><br/>

					<button class="btn btn-primary" type="submit" :disabled="processing">
						<i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
						<i v-else class="fa fa-spin fa-spinner"></i>
						Add
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
		title: 'Add Custom Image'
	},
	watch: {
		from(val) {
			let vm = this;
			if (val !== 'default') {
				let select = $('[name="hypervisor_id"]');
				if (select.hasClass('select2-hidden-accessible')) {
					select.removeClass('select2-hidden-accessible');
				}
				select.select2({
					placeholder: 'Select',
					ajax: {
						url: vm.$axios.defaults.baseURL + '/admin/hypervisors',
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
							let hypervisors = [];
							data.data.forEach((hypervisor) => {
								hypervisors.push({id: hypervisor.id, text: hypervisor.ip, hypervisor: hypervisor});
							});
							return {
								results: hypervisors
							}
						},
						cache: true
					},
				});
			} else {
				let select = $('[name="hypervisor_id"]');
				if (select.hasClass('select2-hidden-accessible')) {
					select.select2('destroy');
				}
			}
		}
	},
	data() {
		return {
			processing: false,
			from: 'default',
		}
	},
	async asyncData({$axios, route}) {

	},
	methods: {
		add() {
			this.processing = true;
			this.$axios.post('/admin/images/add', $('form').serialize()).then((response) => {
				this.processing = false;
				this.$router.push({name: 'admin-image-id', params: {id: repsonse.data.image.id}});
			}).catch((error) => {
				this.processing = false;
			});
		}
	},
	mounted() {
		let vm = this;
		$('[name="user_id"]').select2({
			placeholder: 'Optional',
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
					let users = [];
					data.data.forEach((user) => {
						users.push({id: user.id, text: user.email, user: user});
					});
					return {
						results: users
					}
				},
				cache: true
			},
		});


		$('[name="distro"]').select2({
			placeholder: 'Select Distro',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/distros',
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
					let distros = [];
					data.data.forEach((distro) => {
						distros.push({id: distro.short_name, text: distro.display_name, distro: distro});
					});
					return {
						results: distros
					}
				},
				cache: true
			},
			templateResult: function (state) {
				if (!state.id) {
					return state.text
				}
				var baseUrl = "/assets";
				return $(
					'<span><img src="' + baseUrl + '/' + state.distro.image + '" style="height:32px;width:32px" /> ' + state.text + '</span>'
				);
			},
			templateSelection: function (state) {
				if (!state.id) {
					return state.text
				}
				var baseUrl = "/assets";
				return $(
					'<span><img src="' + baseUrl + '/' + state.distro.image + '" style="height:32px;width:32px" /> ' + state.text + '</span>'
				);
			},
			escapeMarkup: function (m) {
				return m;
			},
		});

		$('[name="from"]').select2({placeholder: 'Select'}).on('change', function () {
			vm.from = this.value;
		});
	}
}
</script>
