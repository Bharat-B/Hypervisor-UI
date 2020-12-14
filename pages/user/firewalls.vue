<template>
	<div class="dashcontent">
		<h1><i aria-hidden="true" class="fa fa-ban"></i> Firewalls</h1>
		<div class="dropdown manybtn">
			<button id="dropdownMenu2" aria-expanded="false" aria-haspopup="true" class="dropdown-toggle"
					data-toggle="dropdown"
					type="button">
				<i aria-hidden="true" class="fa fa-plus-circle"></i> Create
				<span class="caret"></span>
			</button>
			<ul aria-labelledby="dropdownMenu2" class="dropdown-menu">
				<li v-if="is_reseller">
					<nuxt-link :to="{name: 'user-subuser-create'}">New Subuser</nuxt-link>
				</li>
				<li v-if="enabledBilling && !is_reseller">
					<nuxt-link :to="{name: 'user-instance-create'}">New Instance</nuxt-link>
				</li>
				<li v-if="is_reseller">
					<nuxt-link :to="{name: 'user-instance-reseller-create'}">New Instance</nuxt-link>
				</li>
				<li>
					<nuxt-link :to="{name: 'user-firewall-create'}">New Firewall</nuxt-link>
				</li>
				<li>
					<nuxt-link :to="{name: 'user-recipe-create'}">New Recipe</nuxt-link>
				</li>
				<li>
					<nuxt-link :to="{name: 'user-ssh-key-create'}">New SSH Key</nuxt-link>
				</li>
			</ul>
		</div>
		<div class="dashstuff">
			<div class="col-md-10">
				<div v-if="firewalls.data.length > 0" class="wow fadeIn blocks firewall-manage">
					<input v-model="pagination_search" placeholder="Search Firewall.." type="search"
						   @keyup.enter="search">
					<div class="table-responsive">
						<table class="table">
							<thead>
							<tr>
								<th>Name</th>
								<th>Rules</th>
								<th>Created on</th>
								<th></th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="firewall in firewalls.data">
								<td>
									<nuxt-link :to="{ name: 'user-firewall-id', params: {id: firewall.id} }"><p>
										{{ firewall.name }}</p>
									</nuxt-link>
								</td>
								<td>{{ firewall.rules.length }}</td>
								<td><p>{{ firewall.created_at }}</p></td>
								<td>
									<nuxt-link :to="{ name: 'user-firewall-id', params: {id: firewall.id} }">
										<button class="btn btn-default"><i aria-hidden="true"
																		   class="fa fa-terminal famore"></i> Edit
										</button>
									</nuxt-link>
									<button class="btn btn-default" @click.prevent=""><i aria-hidden="true"
																						 class="fa fa-trash"></i>
									</button>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
					<pagination :pagination="firewalls" :search="pagination_search" @paginate="page"></pagination>
				</div>
				<div v-else class="wow fadeIn blocks firewall-manage">
					<h1 class="text-center">No Firewalls created!</h1>
					<div class="text-center">
						<nuxt-link to="/user/firewall/create">
							<button class="btn btn-primary normal">
								<i aria-hidden="true" class="fa fa-plus-circle"></i> Add New
							</button>
						</nuxt-link>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>
<script>
import pagination from '~/components/pagination.vue'

export default {
	watchQuery: true,
	head: {
		title: 'Firewalls'
	},
	components: {
		pagination
	},
	layout: 'user',
	data() {
		return {
			getRoute: "user/firewalls",
			pagination_search: "",
			pagination_store: {no: 1, items: 20},
			firewalls: {
				total: 0,
				data: []
			}
		}
	},
	asyncData({$axios, route}) {
		let pagination_search = '';
		const pagination_store = {
			no: route.query.page ? route.query.page : 1,
			items: route.query.per_page ? route.query.per_page : 20,
		};
		if (route.query && route.query.search !== '') {
			pagination_search = route.query.search;
		}
		return $axios.get('user/firewalls', {
			params: {
				page: pagination_store.no,
				per_page: pagination_store.items,
				search: pagination_search
			}
		}).then((response) => {
			return {
				firewalls: response.data,
				pagination_search: pagination_search,
				pagination_store: pagination_store,
				getRoute: "user/firewalls"
			}
		}).catch((error) => {

		});
	},
	methods: {
		page(a, b, c = '') {
			this.$router.replace({
				name: this.$route.name, query: {
					page: a,
					per_page: b,
					search: c
				}
			})
		},
		search() {
			this.$router.replace({
				name: this.$route.name, query: {
					page: this.$route.query.page,
					per_page: this.$route.query.per_page,
					search: this.pagination_search
				}
			})
		},
		destroy(firewall) {
			let vm = this;
			bootbox.confirm({
				title: "Are you sure you want to remove this Firewall?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove Plan',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/user/firewall/' + plan.id).then(async (response) => {
							await vm.$axios.get('/user/firewalls', {
								params: {
									page: vm.route.query.page ? vm.route.query.page : 1,
									per_page: vm.route.query.per_page ? vm.route.query.per_page : 20,
									search: vm.route.query.pagination_search ? vm.route.query.pagination_search : ''
								}
							}).then((response) => {
								vm.$set(vm, "firewalls", response.data);
							})
						}).catch((error) => {
						});
					}
				}
			});
		}
	}
}
</script>
