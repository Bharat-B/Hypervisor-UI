<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-linux" aria-hidden="true"></i> Edit Image</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="update">
					<div class="row">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="name" class="form-control" v-model="image.name">
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>URL:</h5>
						</div>
						<div class="col-md-3">
							<h5>{{ image.url !== '' ? image.url : 'N/A' }}</h5>
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
							<input type="checkbox" name="modify" id="modify" value="1" :checked="image.modify === 1"/>
							<label class="switchy" for="modify"/>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-2">
							<h5>Private Image:</h5>
						</div>
						<div class="col-md-3">
							<input type="checkbox" name="type" value="public"/>
							<input type="checkbox" name="type" id="private" value="private"
								   :checked="image.type === 'private'"/>
							<label class="switchy" for="private"/>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2"></div>
						<div class="col-md-3">
							<button class="btn btn-primary" type="submit" :disabled="processing">
								<i v-if="!processing" class="fa fa-edit" aria-hidden="true"></i>
								<i v-else class="fa fa-spin fa-spinner"></i>
								Update
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
		title: 'Edit Image'
	},
	data() {
		return {
			image: {},
			processing: false
		}
	},
	async asyncData({$axios, route, redirect}) {
		let image = await $axios.get('/admin/images/' + route.params.id).catch((error) => {
			redirect('/admin/images');
		});
		return {
			image: image.data
		}
	},
	methods: {
		update() {
			this.$axios.patch('/admin/images/' + this.image.id, $('form').serialize());
		}
	},
	mounted() {
		let vm = this;
		let distro = [];
		if (vm.image.distro !== '' && this.$store.state.global.environment.distros[this.image.distro].short_name) {
			distro.push({
				id: vm.image.distro,
				text: this.$store.state.global.environment.distros[this.image.distro].display_name,
				distro: this.$store.state.global.environment.distros[this.image.distro],
				selected: true
			});
		}
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
			data: distro,
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
	}
}
</script>
