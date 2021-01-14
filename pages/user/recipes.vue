<template>
	<div class="dashcontent">
		<h1><i class="fa fa-terminal famore" aria-hidden="true"></i> Recipes</h1>
		<div class="dropdown manybtn">
			<button class="dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
					aria-expanded="false">
				<i class="fa fa-plus-circle" aria-hidden="true"></i> Create
				<span class="caret"></span>
			</button>
			<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
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
				<div class="wow fadeIn blocks firewall-manage recipes" v-if="recipes.data.length >= 1">
					<input type="search" placeholder="Search Recipes" v-model="pagination_search" @keyup.enter="search"/>
					<br><br>
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
							<tr v-for="recipe in recipes.data">
								<td>
									<nuxt-link :to="{ name: 'user-recipe-id', params: {id: recipe.id} }"><p>
										{{ recipe.name }}</p></nuxt-link>
								</td>
								<td><p>{{ recipe.created_at }}</p></td>
								<td>
									<nuxt-link :to="{ name: 'user-recipe-id', params: {id: recipe.id} }">
										<button class="btn btn-default"><i class="fa fa-terminal famore"
																		   aria-hidden="true"></i> Edit
										</button>
									</nuxt-link>
									<button class="btn btn-default" @click.prevent="destroy(recipe.id)"><i
										class="fa fa-trash" aria-hidden="true"></i></button>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
					<pagination :search="pagination_search" :pagination="recipes" @paginate="page"></pagination>
				</div>
				<div class="wow fadeIn blocks firewall-manage recipes" v-else>
					<h1 class="text-center">No Recipes created!</h1>
					<div class="text-center">
						<nuxt-link :to="{name: 'user-recipe-create'}">
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
		title: 'Recipes'
	},
	components: {
		pagination
	},
	layout: 'user',
	data() {
		return {
			getRoute: "user/recipes",
			pagination_search: "",
			pagination_store: {no: 1, items: 20},
			recipes: {
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
		return $axios.get('user/recipes', {
			params: {
				page: pagination_store.no,
				per_page: pagination_store.items,
				search: pagination_search
			}
		}).then((response) => {
			return {
				recipes: response.data,
				pagination_search: pagination_search,
				pagination_store: pagination_store,
				getRoute: "user/recipes"
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
			let vm = this;
			bootbox.confirm({
				title: "Are you sure you want to delete this recipe?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Delete Recipe',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('user/recipe/' + id).then((response) => {
							setTimeout(()=>{
								vm.search()
							},2000);
						}).catch((error) => {

						});
					}
				}
			});
		}
	}
}
</script>
