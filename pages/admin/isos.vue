<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-compact-disc" aria-hidden="true"></i> ISO(s)</h2>
		<div class="col-md-12 email isos">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.." v-model="iso_pagination.search"
						   @keyup.enter="search">
				</div>
				<div class="pull-right createit">
					<nuxt-link tag="a" :to="{name: 'admin-distros'}" class="btn btn-primary"><i class="fab fa-redhat"
																								aria-hidden="true"></i>&nbsp;Distros
					</nuxt-link>
					<nuxt-link tag="a" :to="{name: 'admin-iso-create'}" class="btn btn-primary"><i class="fa fa-plus"
																								   aria-hidden="true"></i>&nbsp;Add
						ISO
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
						<tr v-for="iso in iso_pagination.isos.data">
							<td><img :src="'/assets/'+iso.distro.image" style="height: 32px; width: 32px;"/></td>
							<td>{{ iso.name }}</td>
							<td>{{ iso.filename }}</td>
							<td>{{ $Kb2Gb(iso.size) }}</td>
							<td>{{ iso.url !== '' ? $cutstring(iso.url) : 'Prebuilt' }}</td>
							<td>{{ $ucfirst(iso.type) }}</td>
							<td>{{ iso.user_id !== '' ? iso.user.email : 'N/A' }}</td>
							<td class="actions">
								<nuxt-link tag="button" :to="{name: 'admin-iso-id', params:{id: iso.id}}"
										   class="btn btn-default"><i
									class="fa fa-edit" aria-hidden="true"></i></nuxt-link>
								<button class="btn btn-default" @click.prevent="destroy(iso)"><i class="fa fa-trash"
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
								aria-expanded="false"> {{ iso_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: iso_pagination.per_page === 20}"><a href="#"
																					 @click.prevent="$set($data.iso_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: iso_pagination.per_page === 50}"><a href="#"
																					 @click.prevent="$set($data.iso_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: iso_pagination.per_page === 100}"><a href="#"
																					  @click.prevent="$set($data.iso_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"> Page {{ iso_pagination.isos.current_page }}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(iso_pagination.isos.last_page)">
								<a href="#" @click.prevent="$set($data.iso_pagination,'page',i)">
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
		title: 'ISO(s)'
	},
	watch: {
		'iso_pagination.page': function () {
			this.search();
		},
		'iso_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			iso_pagination: {
				page: 1,
				per_page: 20,
				isos: {
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
					page: this.iso_pagination.page,
					per_page: this.iso_pagination.per_page,
					search: this.iso_pagination.search
				}
			})
		},
		destroy(iso) {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Are you sure you want to remove this iso?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove ISO',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/admin/isos/' + iso.id).then(async (response) => {
							await vm.$axios.get('/admin/isos', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.search ? vm.route.query.search : ''
								}
							}).then((response) => {
								vm.$set(vm.iso_pagination, "isos", response.data);
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
		return $axios.get('/admin/isos', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				iso_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					isos: response.data
				},
			}
		}).catch((error) => {
		})
	}
}
</script>
