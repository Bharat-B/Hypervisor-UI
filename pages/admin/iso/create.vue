<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-compact-disc" aria-hidden="true"></i>Add ISO</h2>
		<div class="col-md-6">
			<div class="box storage user">
				<form @submit.prevent="create">
					<div class="form-group row" :class="{'has-error': errors.name}">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="col-md-6">
							<input type="text" name="name" class="form-control">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="form-group row" :class="{'has-error': errors.url}">
						<div class="col-md-2">
							<h5>URL</h5>
						</div>
						<div class="col-md-6">
							<input type="text" name="url" class="form-control" placeholder="http://url/to/centos.iso">
							<span class="help-block" v-if="errors.url">{{ errors.url[0] }}</span>
						</div>
					</div>
					<div class="form-group row" :class="{'has-error': errors.distro}">
						<div class="col-md-2">
							<h5>Distro:</h5>
						</div>
						<div class="col-md-4">
							<select name="distro" class="form-control">
								<option value=""></option>
							</select>
							<span class="help-block" v-if="errors.distro">{{ errors.distro[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2"></div>
						<div class="col-md-4">
							<button class="btn btn-primary" type="submit" :disabled="processing">
								<i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
								<i v-else class="fa fa-spin fa-spinner"></i>
								Add
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Add ISO'
	},
	data() {
		return {
			processing: false
		}
	},
	methods: {
		create() {
			this.processing = true;
			this.$axios.post('/admin/isos', $('form').serialize()).catch(() => {
				this.processing = false;
			});
			this.processing = false;
		}
	},
	async asyncData({$axios, route}) {

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
				cache: true,


			},
			templateResult: function (state) {
				if (!state.id) {
					return state.text
				}
				var baseUrl = "/assets";
				var $state = $(
					'<span><img src="' + baseUrl + '/' + state.distro.image + '" style="height:32px;width:32px" /> ' + state.text + '</span>'
				);
				return $state;
			},
			templateSelection: function (state) {
				if (!state.id) {
					return state.text
				}
				var baseUrl = "/assets";
				var $state = $(
					'<span><img src="' + baseUrl + '/' + state.distro.image + '" style="height:32px;width:32px" /> ' + state.text + '</span>'
				);
				return $state;
			},
			escapeMarkup: function (m) {

				return m;
			}
		});
	}
}
</script>
