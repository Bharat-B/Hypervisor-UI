<template>
	<div class="dashcontent">
		<h1><i class="fa fa-terminal famore" aria-hidden="true"></i> SSH Keys</h1>
		<div class="dropdown manybtn">
			<button class="dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
					aria-expanded="false">
				<i class="fa fa-plus-circle" aria-hidden="true"></i> Create
				<span class="caret"></span>
			</button>
			<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
				<li v-if="enabledBilling">
					<nuxt-link :to="{name: 'user-instance-create'}">New Instance</nuxt-link>
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
				<div class="wow fadeIn blocks firewall-manage recipes" v-if="keys.data.length >= 1">
					<input type="search" placeholder="Search Keys" v-model="pagination_search" @keyup.enter="search"/>
					<div class="table-responsive">
						<table class="table recipeslist">
							<thead>
							<tr>
								<th>Name</th>
								<th>Data created</th>
								<th></th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="key in keys.data">
								<td>
									<nuxt-link :to="{ name: 'user-ssh-key-id', params: {id: key.id} }"><p>{{
											key.name
										}}</p></nuxt-link>
								</td>
								<td><p>{{ key.created_at }}</p></td>
								<td>
									<nuxt-link :to="{ name: 'user-ssh-key-id', params: {id: key.id} }">
										<button class="btn btn-default"><i class="fa fa-terminal famore"
																		   aria-hidden="true"></i> Edit
										</button>
									</nuxt-link>
									<button class="btn btn-default" @click.prevent="destroy(key.id)"><i
										class="fa fa-trash" aria-hidden="true"></i></button>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
					<pagination :search="pagination_search" :pagination="keys" @paginate="page"></pagination>
				</div>
				<div class="wow fadeIn blocks firewall-manage recipes" v-if="keys.data.length <= 0">
					<h1 class="text-center">No SSH Keys created!</h1>
					<div class="text-center">
						<nuxt-link to="/user/ssh-key/create">
							<button class="btn btn-primary normal">
								<i class="fa fa-plus-circle" aria-hidden="true"></i> Add New
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
		title: 'SSH Keys'
	},
	components: {
		pagination
	},
	layout: 'user',
	data() {
		return {
			getRoute: "user/ssh-keys",
			pagination_search: "",
			pagination_store: {no: 1, items: 20},
			keys: {
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
		return $axios.get('user/ssh-keys', {
			params: {
				page: pagination_store.no,
				per_page: pagination_store.items,
				search: pagination_search
			}
		}).then((response) => {
			return {
				keys: response.data,
				pagination_search: pagination_search,
				pagination_store: pagination_store,
				getRoute: "user/ssh-keys"
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
		destroy(id) {
			this.$axios.delete('/ssh-key/' + id).then((response) => {

			}).catch((error) => {

			})
		}
	}
}
</script>
