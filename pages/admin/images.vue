<template>
	<div class="content animated fadeIn">
		<h2><i class="fab fa-linux" aria-hidden="true"></i> Images</h2>
		<div class="col-md-10 email images">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.." v-model="image_pagination.search"
						   @keyup.enter="search">
				</div>
				<div class="pull-right createit">
					<nuxt-link tag="a" :to="{name: 'admin-distros'}" class="btn btn-primary"><i class="fab fa-redhat"
																								aria-hidden="true"></i>&nbsp;Distros
					</nuxt-link>
					<nuxt-link tag="a" :to="{name: 'admin-image-add'}" class="btn btn-primary"><i class="fa fa-plus"
																								  aria-hidden="true"></i>&nbsp;Add
						Image
					</nuxt-link>
					<nuxt-link tag="a" :to="{name: 'admin-image-create'}" class="btn btn-primary"><i class="fa fa-plus"
																									 aria-hidden="true"></i>&nbsp;Create
						Image
					</nuxt-link>
					<nuxt-link tag="a" :to="{name: 'admin-image-browser'}" class="btn btn-primary"><i class="fa fa-plus"
																									  aria-hidden="true"></i>&nbsp;Browse
						Images
					</nuxt-link>
				</div>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Distro</th>
							<th>Name</th>
							<th>Filename</th>
							<th>Size</th>
							<th>URL</th>
							<th>Type</th>
							<th>User</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="image in image_pagination.images.data">
							<td><img :src="'/assets/'+image.distro.image"/></td>
							<td>{{ image.name }}</td>
							<td>{{ image.filename }}</td>
							<td>{{ $Kb2Gb(image.size) }}</td>
							<td style="overflow: hidden; text-overflow:ellipsis;">
								{{ image.url !== '' ? $cutstring(image.url) : 'Prebuilt' }}
							</td>
							<td>{{ $ucfirst(image.type) }}</td>
							<td>{{ image.user_id !== '' ? image.user.email : 'N/A' }}</td>
							<td class="actions">
								<nuxt-link tag="button" :to="{name: 'admin-image-id', params:{id: image.id}}"
										   class="btn btn-default"><i
									class="fa fa-edit" aria-hidden="true"></i></nuxt-link>
								<button class="btn btn-default" @click.prevent="destroy(image)"><i class="fa fa-trash"
																								   aria-hidden="true"></i>
								</button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="ipages">
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"> {{ image_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: image_pagination.per_page === 20}"><a href="#"
																					   @click.prevent="$set($data.image_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: image_pagination.per_page === 50}"><a href="#"
																					   @click.prevent="$set($data.image_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: image_pagination.per_page === 100}"><a href="#"
																						@click.prevent="$set($data.image_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"> Page {{ image_pagination.images.current_page }}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(image_pagination.images.last_page)">
								<a href="#" @click.prevent="$set($data.image_pagination,'page',i)">
									{{ i }}
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'admin',
	head: {
		title: 'Images'
	},
	watchQuery: true,
	watch: {
		'image_pagination.page': function () {
			this.search();
		},
		'image_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			image_pagination: {
				page: 1,
				per_page: 20,
				images: {
					data: [],
					total: 0
				},
				search: ""
			}
		}
	},
	methods: {
		async search() {
			this.$router.replace({
				name: this.$route.name,
				query: {
					page: this.image_pagination.page,
					per_page: this.image_pagination.per_page,
					search: this.image_pagination.search
				}
			})
		},
		destroy(image) {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Are you sure you want to remove this Image?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove Image',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/admin/images/' + image.id).then(async (response) => {
							await vm.$axios.get('/admin/images', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.search ? vm.route.query.search : ''
								}
							}).then((response) => {
								vm.$set(vm.image_pagination, "images", response.data);
							})
						}).catch((error) => {
							vm.processing = false;
						});
					}
					vm.processing = false;
				}
			});
		}
	},
	asyncData({$axios, route}) {
		return $axios.get('/admin/images', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				image_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					images: response.data
				},
			}
		}).catch((error) => {
		})
	}
}
</script>
