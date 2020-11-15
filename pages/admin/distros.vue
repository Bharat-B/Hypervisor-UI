<template>
	<div class="content animated fadeIn">
		<h2><i class="fab fa-redhat" aria-hidden="true"></i> Distros</h2>
		<div class="col-md-6 email distros">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.." v-model="distro_pagination.search"
						   @keyup.enter="search">
				</div>
				<nuxt-link tag="button" :to="{name: 'admin-distro-create'}" class="btn btn-primary createit"><i
					class="fa fa-plus" aria-hidden="true"></i>&nbsp; Create Distro
				</nuxt-link>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Distro</th>
							<th>Display Name</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="distro in distro_pagination.distros.data">
							<td><img style="height: 48px; width: 48px;" :src="'/assets/'+distro.image"/></td>
							<td>{{ distro.display_name }}</td>
							<td class="actions">
								<nuxt-link tag="button" :to="{name: 'admin-distro-id', params:{id: distro.id}}"
										   class="btn btn-default"><i class="fa fa-edit" aria-hidden="true"></i>
								</nuxt-link>
								<button class="btn btn-default" @click.prevent="destroy(distro)"><i class="fa fa-trash"
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
								aria-haspopup="true" aria-expanded="false"> {{ distro_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: distro_pagination.per_page === 20}"><a href="#"
																						@click.prevent="$set($data.distro_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: distro_pagination.per_page === 50}"><a href="#"
																						@click.prevent="$set($data.distro_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: distro_pagination.per_page === 100}"><a href="#"
																						 @click.prevent="$set($data.distro_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> Page
							{{ distro_pagination.distros.current_page }}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(distro_pagination.distros.last_page)">
								<a href="#" @click.prevent="$set($data.distro_pagination,'page',i)">
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
		title: 'Distros'
	},
	watchQuery: true,
	watch: {
		'distro_pagination.page': function () {
			this.search();
		},
		'distro_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			distro_pagination: {
				page: 1,
				per_page: 20,
				distros: {
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
					page: this.distro_pagination.page,
					per_page: this.distro_pagination.per_page,
					search: this.distro_pagination.search
				}
			})
		},
		destroy(distro) {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Are you sure you want to remove this Distro?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove Distro',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/admin/distros/' + distro.id).then(async (response) => {
							await vm.$axios.get('/admin/distros', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.search ? vm.route.query.search : ''
								}
							}).then((response) => {
								vm.$set(vm.distro_pagination, "distros", response.data);
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
		return $axios.get('/admin/distros', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				distro_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					distros: response.data
				},
			}
		}).catch((error) => {
		})
	}
}
</script>
