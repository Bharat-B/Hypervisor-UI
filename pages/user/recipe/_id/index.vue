<template>
	<div class="dashcontent">
		<h1><i class="fa fa-terminal famore" aria-hidden="true"></i> Edit Recipe</h1>
		<div class="dashstuff">
			<div class="col-md-8">
				<div class="wow fadeIn blocks firewall-manage recipes">
					<nuxt-link :to="{name: 'user-recipes'}" class="btn btn-default"><i class="fa fa-chevron-left"
																					   aria-hidden="true"></i> Back to
						all recipes
					</nuxt-link>
					<br/><br/><br/>
					<form @submit.prevent="update">
						<div class="form-group" :class="{'has-error': errors.name }">
							<input placeholder="Recipe Name" class="nrecipe form-control" v-model="recipe.name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>

						<br/><br/><br/>
						<div class="form-group" :class="{'has-error': errors.recipe }">
							<div class="valuerecipe">
							</div>
							<span class="help-block" v-if="errors.recipe">{{ errors.recipe[0] }}</span>
						</div>
						<br/><br/>
						<button type="submit" class="btn btn-primary" :class="{disabled: processing}"
								:disabled="processing">
							<span v-if="processing"><i class="fa fa-spin fa-spinner"></i> Updating</span>
							<span v-else>Update</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'user',
	head: {
		title: 'Edit Recipe'
	},
	data() {
		return {
			processing: false,
		}
	},
	methods: {
		async update() {
			let vm = this;
			vm.processing = true;
			await this.$axios.patch('user/recipe/' + vm.recipe.id, vm.recipe).catch((e) => {
			});
			vm.processing = false;
		}
	},
	asyncData({$axios, route}) {
		return $axios.get('user/recipes/' + route.params.id).then((response) => {
			return {
				recipe: response.data
			}
		}).catch((error) => {

		});

	},
	mounted() {
		let vm = this;
		var editorContainer = document.querySelector('.valuerecipe');
		CodeMirror(editorContainer, {
			lineNumbers: true,
			mode: 'shell',
			theme: 'darcula',
			value: vm.recipe.recipe
		}).on("change", function (cm, change) {
			vm.recipe.recipe = cm.getValue();
		});
		new WOW().init(
			{
				boxClass: 'wow',
				animateClass: 'animated',
				offset: 0,
				mobile: false,
				live: true
			}
		);
		$(document).ready(function () {
			$('.js-example-basic-single').select2({});
		});
	}
}
</script>
