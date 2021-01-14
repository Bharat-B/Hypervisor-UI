<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-linux" aria-hidden="true"></i> Edit Email</h2>
		<div class="col-md-10">
			<div class="box storage">
				<form @submit.prevent="update">
					<div class="form-group row">
						<div class="col-lg-2">
							<label class="col-form-label">
								Name
							</label>
						</div>
						<div class="col-lg-6">
							<label class="col-form-label">{{ email.name }}</label>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-lg-2">
							<label class="col-form-label">
								Available Variables
							</label>
						</div>
						<div class="col-lg-10">
							<label class="col-form-label" v-html="email.description"></label>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-lg-2">
							<label class="col-form-label">
								Template
							</label>
						</div>
						<div class="col-lg-10">
							<textarea id="code">{{ format(email.message) }}</textarea>
							<input type="hidden" name="message" v-model="email.message">
							<br><br>
							<button id="submitBtn" type="submit" class="btn btn-primary"> Update</button>
							<button type="button" role="button" class="btn btn-primary" @click.prevent="preview()"><i
								class="fa fa-eye"></i> Preview
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
		title: 'Edit Email Template'
	},
	data() {
		return {
			email: {},
			processing: false
		}
	},
	methods: {
		update() {
			this.$axios.patch('/admin/emails/' + this.email.id, $('form').serialize()).catch((error)=>{

			});
		},
		preview() {
			let x = window.open('', '', 'height=768px,width=1024px');
			x.document.open();
			x.document.write(this.email.message);
			x.document.close();
		},
		format(html) {
			var tab = '\t';
			var result = '';
			var indent = '';

			html.split(/>\s*</).forEach(function (element) {
				if (element.match(/^\/\w/)) {
					indent = indent.substring(tab.length);
				}

				result += indent + '<' + element + '>\r\n';

				if (element.match(/^<?\w[^>]*[^\/]$/)) {
					indent += tab;
				}
			});

			return result.substring(1, result.length - 3);
		},
	},
	async asyncData({route, redirect, params, $axios}) {
		let response = await $axios.get('/admin/emails/' + route.params.id).catch((error) => {
			redirect('/admin/emails');
		});
		if (response) {
			return {
				email: response.data
			}
		}
	},
	mounted() {
		let vm = this;
		CodeMirror.fromTextArea(document.getElementById('code'), {
			mode: "htmlmixed",
			theme: 'dracula',
			styleActiveLine: true,
			matchBrackets: true,
			lineNumbers: true
		}).on("change", function (cm, change) {
			vm.email.message = cm.getValue();
		});
	}
}
</script>
