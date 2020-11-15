<template>
	<div class="content animated fadeIn">
		<h2><i class="fas fa-box-open" aria-hidden="true"></i> Update Image Group</h2>
		<div class="col-md-10">
			<form @submit.prevent="update">
				<div class="box storage">
					<div class="form-group row" :class="{'has-error': errors.name}">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="name" class="form-control" v-model="image_group.name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="form-group row" :class="{'has-error': errors.description}">
						<div class="col-md-2">
							<h5>Description:</h5>
						</div>
						<div class="col-md-3">
							<textarea name="description" class="form-control">{{ image_group.description }}</textarea>
							<span class="help-block" v-if="errors.description"></span>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-2">
							<h5>Images:</h5>
						</div>
						<div class="col-md-3">
							<select name="images[]" class="form-control" multiple="multiple">
							</select>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-2"></div>
						<div class="col-md-3">
							<button class="btn btn-primary" type="submit" :disabled="processing">
								<i v-if="!processing" class="fa fa-edit" aria-hidden="true"></i>
								<i v-else class="fa fa-spin fa-spinner"></i>
								Update
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Edit Image Group'
	},
	data() {
		return {
			image_group: {},
			selected_images: [],
			existing: [],
			processing: false
		}
	},
	async asyncData({$axios, route}) {
		let existing = [], selected_images = [];
		let image_group_response = await $axios.get('/admin/image-groups/' + route.params.id);
		if (image_group_response) {
			image_group_response.data.images.forEach((image) => {
				existing.push(image.id);
				selected_images.push({id: image.id, text: image.name, selected: true});
			});
		}

		return {
			existing: existing,
			selected_images: selected_images,
			image_group: image_group_response.data
		}
	},
	methods: {
		update() {
			this.processing = true;
			this.$axios.patch('/admin/image-groups/' + this.image_group.id, $('form').serialize()).then((response) => {
				this.processing = false;
			}).catch((error) => {
				this.processing = false;
			});
		}
	},
	mounted() {
		let vm = this;
		$('[name="images[]"]').select2({
			placeholder: 'Select Images',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/admin/images',
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
					let images = [];
					data.data.forEach((image) => {
						images.push({id: image.id, text: image.name});
					});
					return {
						results: images
					}
				},
				cache: true
			},
			data: vm.selected_images
		});
	}
}
</script>
