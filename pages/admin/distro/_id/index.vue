<template>
	<div class="content animated fadeIn">
		<h2> Edit Distro</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="update">
					<div class="row">
						<div class="form-group" :class="{'has-error': errors.display_name}">
							<div class="col-md-2">
								<h5>Name:</h5>
							</div>
							<div class="col-md-3">
								<input type="text" name="display_name" class="form-control"
									   v-model="distro.display_name">
								<span class="help-block" v-if="errors.display_name">{{ errors.display_name[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="form-group" :class="{'has-error': errors.short_name}">
							<div class="col-md-2">
								<h5>Short Name:</h5>
							</div>
							<div class="col-md-3">
								<input type="text" name="short_name" class="form-control" v-model="distro.short_name">
								<span class="help-block" v-if="errors.short_name">{{ errors.short_name[0] }}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="form-group" :class="{'has-error': errors.distro_image}">
							<div class="col-md-2">
								<h5>Distro image:</h5>
							</div>
							<div class="col-md-3">
								<input style="margin-top: 9px;" type="file" name="distro_image" id="fileToUpload">
								<span class="help-block" v-if="errors.distro_image">{{ errors.distro_image[0] }}</span>
							</div>
						</div>
					</div>
					<br/>
					<div class="row">
						<div class="col-md-2">

						</div>
						<button class="btn btn-primary" type="submit" :disabled="processing">
							<i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
							<i v-else class="fa fa-spin fa-spinner"></i>
							Create
						</button>
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
		title: 'Edit Distro'
	},
	data() {
		return {
			processing: false,
			distro: {}
		}
	},
	methods: {
		update() {
			let data = new FormData(), file = document.getElementById('fileToUpload').files[0];
			this.processing = true;
			data.append('display_name', this.display_name);
			data.append('short_name', this.short_name);
			if (file) {
				data.append('distro_image', file, file.name);
			}
			this.$axios.patch('/admin/distros/' + this.$route.params.id, data, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			}).catch((error) => {
				this.processing = false;
			});
			this.processing = false;
		}
	},
	async asyncData({$axios, route, redirect}) {
		let response = await $axios.get('/admin/distros/' + route.params.id).catch((error) => {
			redirect('/admin/distros');
		});
		if (response) {
			return {
				distro: response.data
			}
		}
	},
	mounted() {

	}
}
</script>
