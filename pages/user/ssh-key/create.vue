<template>
	<div class="dashcontent">
		<h1><i class="fa fa-terminal famore" aria-hidden="true"></i> Add SSH Key</h1>
		<div class="dashstuff">
			<div class="col-md-8">
				<div class="wow fadeIn blocks firewall-manage recipes">
					<nuxt-link :to="{name: 'user-ssh-keys'}" class="btn btn-default"><i class="fa fa-chevron-left"
																						aria-hidden="true"></i> Back to
						all ssh keys
					</nuxt-link>
					<br/><br/><br/>
					<form @submit.prevent="create">
						<div class="form-group" :class="{'has-error': errors.name }">
							<input placeholder="Key Name" class="nrecipe form-control" v-model="form.name">
							<span class="help-block" v-if="errors.name">{{ errors.name[0] }}</span>
						</div>

						<br/><br/><br/>
						<div class="form-group" :class="{'has-error': errors.key }">
							<div class="valuerecipe">
							</div>
							<span class="help-block" v-if="errors.key">{{ errors.key[0] }}</span>
						</div>
						<br/><br/>
						<button type="submit" class="btn btn-primary" :class="{disabled: processing}"
								:disabled="processing">
							<span v-if="processing"><i class="fa fa-spin fa-spinner"></i> Creating</span>
							<span v-else>Create</span>
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
		title: 'Add SSH Key'
	},
	data() {
		return {
			processing: false,
			form: {
				name: '',
				key: ''
			}
		}
	},
	methods: {
		async create() {
			let vm = this;
			vm.processing = true;
			await this.$axios.post('user/ssh-keys', vm.form).catch((e) => {
			});
			vm.processing = false;
		}
	},
	mounted() {
		let vm = this;
		var editorContainer = document.querySelector('.valuerecipe');
		CodeMirror(editorContainer).on("change", function (cm, change) {
			vm.form.key = cm.getValue();
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
