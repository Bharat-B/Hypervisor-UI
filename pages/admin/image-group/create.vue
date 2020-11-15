<template>
	<div class="content animated fadeIn">
		<h2><i class="fas fa-box-open" aria-hidden="true"></i> Create Image Group</h2>
		<div class="col-md-10">
			<form @submit.prevent="create">
				<div class="box network">
					<div class="form-group row" :class="{'has-error': errors.name}">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="col-md-3">
							<input type="text" name="name" class="form-control">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="form-group row" :class="{'has-error': errors.description}">
						<div class="col-md-2">
							<h5>Description:</h5>
						</div>
						<div class="col-md-3">
							<textarea name="description" class="form-control"></textarea>
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
								<i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
								<i v-else class="fa fa-spin fa-spinner"></i>
								Create
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
		title: 'Add Image Group'
	},
	data() {
		return {
			processing: false
		}
	},
	async asyncData() {

	},
	methods: {
		create() {
			this.processing = true;
			this.$axios.post('/admin/image-groups', $('form').serialize()).then((response) => {
				this.processing = false;
				this.$router.push({name: 'admin-image-group-id', params: {id: response.data.image_group.id}});
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
		});
	}
}
</script>
