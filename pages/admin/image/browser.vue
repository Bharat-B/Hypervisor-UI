<template>
	<div class="content animated fadeIn email images">
		<h2><i class="fa fa-linux" aria-hidden="true"></i> Images Browser</h2>
		<div class="col-md-10">
			<div class="box storage">
				<div class="input-group col-md-3">
					<select name="distro" class="form-control" v-model="distro" data-width="100%">
					</select>
				</div>
				<br>
				<div style="margin-top: 0px;" class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Name</th>
							<th>Distro</th>
							<th>Size</th>
							<th>Download</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="image in images[distro]">
							<td>{{ image.name }}</td>
							<td><img :src="'/assets/'+image.distro+'.png'"/></td>
							<td>{{ $Kb2Gb(image.size) }}</td>
							<td>
								<input type="checkbox" :id="'image'+image.osid" v-model="image.selected"
									   @change="download(image)" :checked="image.selected"/>
								<label class="switchy" :for="'image'+image.osid"/>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Image Browser'
	},
	data() {
		return {
			distro: 'centos',
			images: [],
			db_images: []
		}
	},
	methods: {
		download(image) {
			if (image.selected) {
				this.$axios.post('/admin/images/add', image).then((response) => {
					for (let distro in this.images) {
						this.images[distro].forEach((rimage, k) => {
							if (rimage.osid === image.osid) {
								this.images[distro][k].id = response.data.image.id;
							}
						})
					}
				});
			} else {
				this.$axios.delete('/admin/images/' + image.id);
			}
		}
	},
	async asyncData({$axios, route}) {
		let response = await $axios.get('/admin/images/browser'),
			distros = [],
			distro_names = {
				centos: "CentOS",
				debian: "Debian",
				ubuntu: "Ubuntu",
				fedora: "Fedora",
				scientific: "Scientific"
			}, do_images = [];

		let dbimages = await $axios.get('/admin/images');
		if (dbimages) {
			dbimages.data.data.forEach((image) => {
				do_images.push(image.osid);
			});
			if (dbimages.data.last_page !== 1) {
				for (let i = 2; i <= response.data.last_page; i++) {
					let dbimages = await this.$axios.get('/admin/images', {params: {page: i}});
					if (dbimages) {
						dbimages.data.data.forEach((image) => {
							do_images.push(image.osid);
						});
					}
				}
			}
		}

		if (response) {
			for (let distro in response.data) {
				response.data[distro].forEach((image, k) => {
					if (do_images.indexOf(image.osid) !== -1) {
						response.data[distro][k].selected = true;
					}
				});
				distros.push({
					id: distro,
					text: distro_names[distro],
					selected: route.params.distro ? route.params.distro === distro : distro === 'centos'
				});
			}
		}

		return {
			distro: 'centos',
			distros: distros,
			images: response.data,
			db_images: do_images
		}
	},

	mounted() {
		let vm = this;
		$('[name="distro"]').select2({
			placeholder: "Select Distro",
			data: this.distros
		}).on('change', function () {
			vm.$set(vm, "distro", this.value);
		})
	}
}
</script>
