<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-compact-disc" aria-hidden="true"></i>Edit ISO</h2>
		<div class="col-md-6">
			<div class="box storage user">
				<form @submit.prevent="update">
					<div class="form-group row" :class="{'has-error': errors.name}">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="col-md-6">
							<input type="text" name="name" class="form-control" v-model="iso.name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="form-group row" :class="{'has-error': errors.url}">
						<div class="col-md-2">
							<h5>URL:</h5>
						</div>
						<div class="col-md-6">
							<h5>{{ iso.url !== '' ? iso.url : 'N/A' }}</h5>
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
					<div class="form-group row"  :class="{'has-error': errors.user_id}">
						<div class="col-md-2">
							<h5>User:</h5>
						</div>
						<div class="col-md-4">
							<select2 v-bind:name="'user_id'" v-bind:allowclear="'true'" data-width="100%" v-once></select2>
							<span class="help-block" v-if="errors.user_id">{{ errors.user_id[0] }}</span>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-2">
							<h5>Private Image:</h5>
						</div>
						<div class="col-md-3">
							<input type="checkbox" name="type" value="public"/>
							<input type="checkbox" name="type" id="private" value="private" :checked="iso.type === 'private'"/>
							<label class="switchy" for="private"/>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2"></div>
						<div class="col-md-4">
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
import Select2 from "@/components/bootstrap/select2";

export default {
	layout: 'admin',
	components: {
		'select2': Select2
	},
	head: {
		title: 'Edit ISO'
	},
	data() {
		return {
			processing: false,
			iso: {}
		}
	},
	methods: {
		update() {
			this.processing = true;
			this.$axios.patch('/admin/isos/' + this.iso.id, $('form').serialize()).catch(() => {
				this.processing = false;
			});
			this.processing = false;
		}
	},
	async asyncData({$axios, route, redirect}) {
		let iso = await $axios.get('/admin/isos/' + route.params.id).catch((error) => {
			redirect('/admin/isos');
		});
		return {
			iso: iso.data
		}
	},
	mounted() {
		let vm = this;
		let distro = [], user = [];
		if (vm.iso.distro !== '' && this.$store.state.global.environment.distros[this.iso.distro].short_name) {
			distro.push({
				id: vm.iso.distro,
				text: this.$store.state.global.environment.distros[this.iso.distro].display_name,
				distro: this.$store.state.global.environment.distros[this.iso.distro],
				selected: true
			});
		}
		if(vm.iso.user){
			user.push({
				id: vm.iso.user_id,
				text: [vm.iso.user.first_name, vm.iso.user.last_name].join(' '),
				user: vm.iso.user,
				selected: true
			})
		}
		$('[name="user_id"]').select2({
			placeholder: 'Select User',
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
						users.push({id: user.id, text: [user.first_name, user.last_name].join(' '), user: user});
					});
					return {
						results: users
					}
				},
				cache: true
			},
			data: user
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
				cache: true,
			},
			data: distro,
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
