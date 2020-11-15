<template>
	<div class="content animated fadeIn">
		<h2><i class="fas fa-box-open" aria-hidden="true"></i> Image Groups</h2>
		<div class="col-md-10 email images">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.."
						   v-model="image_groups_pagination.search"
						   @keyup.enter="search">
				</div>
				<div class="pull-right">
					<nuxt-link tag="button" :to="{name: 'admin-image-group-create'}" class="btn btn-primary createit"><i
						class="fa fa-plus" aria-hidden="true"></i>&nbsp;Create Group
					</nuxt-link>
				</div>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Name</th>
							<th>Description</th>
							<th>Images</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="image_group in image_groups_pagination.groups.data">
							<td>{{ image_group.name }}</td>
							<td>{{ image_group.description }}</td>
							<td>{{ image_group.images.length }}</td>
							<td class="actions">
								<nuxt-link tag="button"
										   :to="{name: 'admin-image-group-id', params:{id: image_group.id}}"
										   class="btn btn-default"><i class="fa fa-edit" aria-hidden="true"></i>
								</nuxt-link>
								<button class="btn btn-default"><i class="fa fa-trash" aria-hidden="true"></i></button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="ipages">
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"> {{ image_groups_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: image_groups_pagination.per_page === 20}"><a href="#"
																							  @click.prevent="$set($data.image_groups_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: image_groups_pagination.per_page === 50}"><a href="#"
																							  @click.prevent="$set($data.image_groups_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: image_groups_pagination.per_page === 100}"><a href="#"
																							   @click.prevent="$set($data.image_groups_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"> Page {{ image_groups_pagination.groups.current_page }}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(image_groups_pagination.groups.last_page)">
								<a href="#" @click.prevent="$set($data.image_groups_pagination,'page',i)">
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
	watchQuery: true,
	head: {
		title: 'Image Groups'
	},
	watch: {
		'hypervisor_pagination.page': function () {
			this.search();
		},
		'hypervisor_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			image_groups_pagination: {
				page: 1,
				per_page: 20,
				groups: {
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
					page: this.image_groups_pagination.page,
					per_page: this.image_groups_pagination.per_page,
					search: this.image_groups_pagination.search
				}
			})
		},
		destroy(group) {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Are you sure you want to remove this group?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove Image Group',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/admin/image-groups/' + group.id).then(async (response) => {
							await vm.$axios.get('/admin/image-groups', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.search ? vm.route.query.search : ''
								}
							}).then((response) => {
								vm.$set(vm.image_groups_pagination, "groups", response.data);
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
		return $axios.get('/admin/image-groups', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				image_groups_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					groups: response.data
				},
			}
		}).catch((error) => {
		})
	}
}
</script>
