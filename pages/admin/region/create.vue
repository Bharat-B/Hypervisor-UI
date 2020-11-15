<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-map-marker" aria-hidden="true"></i> Create Region</h2>
		<div class="col-md-10">
			<form @submit.prevent="create">
				<div class="box storage">
					<div class="row">
						<div class="col-md-2">
							<h5>Name:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.name}">
							<input type="text" name="name" class="form-control" placeholder="Name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Select Country:</h5>
						</div>
						<div class="form-group col-md-3" :class="{'has-error': errors.country}">
							<select class="choose form-control" name="country"></select>
							<span class="help-block" v-if="errors.country">{{ errors.country[0] }}</span>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Locked:</h5>
						</div>
						<div class="col-md-3" :class="{'has-error': errors.locked}">
							<input type="hidden" name="locked" value="0">
							<input type="checkbox" name="locked" id="is_locked" value="1"/>
							<label class="switchy" for="is_locked"></label>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2">
							<h5>Hidden:</h5>
						</div>
						<div class="col-md-3" :class="{'has-error': errors.hidden}">
							<input type="hidden" name="hidden" value="0">
							<input type="checkbox" name="hidden" id="is_hidden" value="1"/>
							<label class="switchy" for="is_hidden"></label>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2"></div>
						<button class="btn btn-primary" type="submit" :disabled="processing">
							<i v-if="!processing" class="fa fa-plus" aria-hidden="true"></i>
							<i v-else class="fa fa-spin fa-spinner"></i>
							Create Region
						</button>
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
		title: 'Add Region'
	},
	methods: {
		create() {
			this.$set(this, 'processing', true);
			this.$axios.post('/admin/regions', $('form').serialize()).then((response) => {
				this.$set(this, 'processing', false);
				this.$router.push({name: 'admin-region-id', params: {id: response.data.region.id}});
			}).catch((error) => {
				this.$set(this, 'processing', false);
			})
		}
	},
	data() {
		return {
			processing: false,
			form: {
				name: '',
				country: 'US',
				is_locked: false,
				is_hidden: false,
				hidden: 0,
				locked: 0
			}
		}
	},
	mounted() {
		let vm = this;
		$('[name="country"]').select2({
			placeholder: "Select Country",
			data: this.$store.state.global.countryList
		}).on('change', function () {
			vm.$set(vm.form, "country", this.value);
		}).val(this.form.country).trigger('change');
	}
}
</script>
