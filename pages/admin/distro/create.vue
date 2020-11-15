<template>
	<div class="content animated fadeIn">
		<h2> Add Distro</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="create">
					<div class="row">
						<div class="form-group" :class="{'has-error': errors.display_name}">
							<div class="col-md-2">
								<h5>Name:</h5>
							</div>
							<div class="col-md-3">
								<input type="text" name="display_name" class="form-control" v-model="display_name">
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
								<input type="text" name="short_name" class="form-control" v-model="short_name">
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
		title: 'Add Distro'
	},
	data() {
		return {
			processing: false,
			display_name: '',
			short_name: ''
		}
	},
	methods: {
		create() {
			let data = new FormData(), file = document.getElementById('fileToUpload').files[0];
			this.processing = true;
			data.append('display_name', this.display_name);
			data.append('short_name', this.short_name);
			if (file) {
				data.append('distro_image', file, file.name);
			}
			this.$axios.post('/admin/distros', data, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			}).catch((error) => {
				this.processing = false;
			});
			this.processing = false;
		}
	},
	asyncData() {

	},
	mounted() {

	}
}
</script>
