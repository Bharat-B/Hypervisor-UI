<template>
	<div class="content animated fadeIn">
		<h2><i class="fab fa-linux" aria-hidden="true"></i> Create Image</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="create">
					<div class="form-group row" :class="{'has-error': errors.name}">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="name" class="form-control">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="form-group row" :class="{'has-error': errors.filename}">
						<div class="col-md-2">
							<h5>Filename:</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="filename" class="form-control" placeholder="image-name">
							<span class="help-block" v-if="errors.filename">{{ errors.filename[0] }}</span>
						</div>
					</div>
					<div class="form-group row" :class="{'has-error': errors.instance}">
						<div class="col-md-2">
							<h5>Instance:</h5>
						</div>
						<div class="col-md-3">
							<select name="instance_id" class="form-control">
								<option value=""></option>
							</select>
							<span class="help-block" v-if="errors.instance">{{ errors.instance[0] }}</span>
						</div>
					</div>
					<div class="form-group row" :class="{'has-error': errors.distro}">
						<div class="col-md-2">
							<h5>Distro:</h5>
						</div>
						<div class="col-md-3">
							<select name="distro" class="form-control">
								<option value=""></option>
							</select>
							<span class="help-block" v-if="errors.distro">{{ errors.distro[0] }}</span>
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
					<button class="btn btn-primary" type="submit" :disabled="processing">
						<i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
						<i v-else class="fa fa-spin fa-spinner"></i>
						Create
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
		title: 'Create Image'
	},
	data() {
		return {
			distros: [],
			processing: false,
		}
	},
	async asyncData({$axios}) {
		let distros = [];
		let distro_response = await $axios.get('/admin/distros');
		if (distro_response) {
			distro_response.data.data.forEach((distro) => {
				distros.push({id: distro.short_name, text: distro.display_name});
			});
			if (distro_response.data.last_page !== 1) {
				for (let i = 2; i <= distro_response.data.last_page; i++) {
					let distro_response = await $axios.get('/admin/distros', {params: {page: i}});
					distro_response.data.data.forEach((distro) => {
						distros.push({id: distro.short_name, text: distro.display_name});
					});
				}
			}
		}
		return {
			distros: distros
		}
	},
	methods: {
		create() {
			this.processing = true;
			this.$axios.post('/admin/images', $('form').serialize()).then((response) => {
				this.processing = false;
				this.$router.push({name: 'admin-tasks'});
			}).catch(() => {
				this.processing = false;
			});
		}
	},
	mounted() {
		let vm = this;
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

		$('[name="instance_id"]').select2({
			placeholder: 'Select Instance',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/instances',
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
						instances.push({
							id: instance.id,
							text: instance.name + '-' + instance.hostname,
							instance: instance
						});
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
