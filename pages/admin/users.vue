<template>
	<div>
		<div class="content animated fadeIn">
			<h2><i class="fa fa-users" aria-hidden="true"></i> Users</h2>
			<div class="col-md-10 email">
				<div class="box">
					<div class="input-group">
						<input type="text" class="form-control" placeholder="Search.." v-model="user_pagination.search" @keyup.enter="search">
					</div>
					<nuxt-link tag="button" :to="{name: 'admin-user-create'}" class="btn btn-primary createit">
						<i class="fa fa-plus" aria-hidden="true"></i>&nbsp; Create User
					</nuxt-link>
					<br><br>
					<div class="row">
						<div class="col-lg-3">
							<label>Role</label>
							<select class="form-control" data-width="100%" name="role_id">
								<option value="0">Any</option>
								<option value="3">User</option>
								<option value="1">Admin</option>
							</select>
						</div>
						<div class="col-lg-3">
							<label>Status</label>
							<select class="form-control" data-width="100%" name="status">
								<option value="0">Inactive</option>
								<option value="1">Active</option>
								<option value="2">Suspended</option>
							</select>
						</div>
						<div class="col-lg-3">
							<label>Show Resellers</label>
							<label class="check">
								<input type="checkbox" id="reseller_check" :checked="filter.reseller === 1">
								<span class="checkmark"></span>
							</label>
						</div>
					</div>
					<div class="table-responsive">
						<table class="table text-center">
							<thead>
							<tr>
								<th class="text-center">Name</th>
								<th class="text-center">Role</th>
								<th class="text-center">Email</th>
								<th class="text-center">Status</th>
								<th class="text-center">Created On</th>
								<th class="actions">Actions</th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="user in user_pagination.users.data">
								<td>{{ user.first_name }} {{ user.last_name }}</td>
								<td>{{ user.role.role }}{{ user.is_reseller === 1 ? ' - Reseller' : '' }}</td>
								<td>{{ user.email }}</td>
								<td>
									<div class="status" :class="{active: user.status === 1, inactive: user.status === 0, suspended: user.status === 2}"></div>
								</td>
								<td>{{ user.created_at }}</td>
								<td class="actions">
									<a data-toggle="modal" data-target="#myModal">
										<button class="btn btn-default" @click.prevent="add_credit(user)"><i class="far fa-money-bill-alt" aria-hidden="true"></i></button>
									</a> &nbsp;
									<a href="#">
										<button class="btn btn-default" @click.prevent="masquerade(user.id)"><i class="fas fa-sign-out-alt" aria-hidden="true"></i></button>
									</a> &nbsp;
									<nuxt-link :to="{name: 'admin-user-id', params:{id: user.id}}" tag="button" class="btn btn-default">
										<i class="fa fa-edit" aria-hidden="true"></i>
									</nuxt-link> &nbsp;
									<button class="btn btn-default" @click.prevent="destroy(user)">
										<i class="fa fa-trash" aria-hidden="true"></i>
									</button>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
					<div class="ipages">
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
									aria-haspopup="true" aria-expanded="false"> {{ user_pagination.per_page }} entries
							</button>
							<ul class="dropdown-menu">
								<li :class="{active: user_pagination.per_page === 20}">
									<a href="#" @click.prevent="$set($data.user_pagination,'per_page',20)">20 entries</a>
								</li>
								<li :class="{active: user_pagination.per_page === 50}">
									<a href="#" @click.prevent="$set($data.user_pagination,'per_page',50)">50 entries</a>
								</li>
								<li :class="{active: user_pagination.per_page === 100}">
									<a href="#" @click.prevent="$set($data.user_pagination,'per_page',100)">100 entries</a>
								</li>
							</ul>
						</div>
						<div class="btn-group dropup">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
									aria-haspopup="true" aria-expanded="false"> Page
								{{ user_pagination.users.current_page }}
								<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
							</button>
							<ul class="dropdown-menu">
								<li v-for="i in $pageRange(user_pagination.users.last_page)">
									<a href="#" @click.prevent="$set($data.user_pagination,'page',i)">
										{{ i }}
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<usercredit :credituser="credit_user" v-if="credit_user.id && credit_user.id !== ''" v-on:closeCredit="close_credit"></usercredit>
	</div>
</template>
<script>
import usercredit from '~/components/usercredit.vue'

export default {
	layout: 'admin',
	head: {
		title: 'Users'
	},
	watchQuery: true,
	components: {
		usercredit
	},
	watch: {
		'user_pagination.page': function () {
			this.search();
		},
		'user_pagination.per_page': function () {
			this.search();
		},
		'filter': {
			handler: function () {
				this.search();
			},
			deep: true
		}
	},
	data() {
		return {
			user_pagination: {
				page: 1,
				per_page: 20,
				users: {
					data: [],
					total: 0
				},
				search: ""
			},
			credit_user: {},
			filter: {
				role_id: 3,
				reseller: 0,
				status: 1
			}
		}
	},
	methods: {
		async search() {
			this.$router.replace({
				name: this.$route.name, query: {
					page: this.user_pagination.page,
					per_page: this.user_pagination.per_page,
					search: this.user_pagination.search,
					role_id: this.filter.role_id,
					reseller: this.filter.reseller,
					status: this.filter.status
				}
			})
		},
		add_credit(user) {
			this.$set(this, "credit_user", user);
			setTimeout(() => {
				let modal = $('body').find('#user-' + this.credit_user.id);
				modal.modal('show')
			}, 100);
		},

		close_credit() {
			let modal = $('body').find('#user-' + this.credit_user.id);
			modal.modal('hide');
			this.$set(this, "credit_user", {});
		},

		masquerade(id) {
			let vm = this;
			vm.$axios.post('/admin/user/' + id + '/login').then((response) => {
				if (response.data.success) {
					window.localStorage.setItem('auth.admin_token', vm.$auth.getToken('local'));
					vm.$auth.setToken('local', 'bearer ' + response.data.token);
					window.location.reload();
				}
			}).catch((error) => {

			});
		},
		destroy(user) {
			let vm = this;
			this.processing = true;
			bootbox.confirm({
				title: "Are you sure you want to remove this User?",
				message: "Please note that no further confirmations will appear!",
				buttons: {
					confirm: {
						label: '<i class="fa fa-check"></i>Remove User',
						className: 'btn-success'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-warning'
					}
				},
				callback: function (result) {
					if (result) {
						vm.$axios.delete('/admin/users/' + user.id).then(async (response) => {
							await vm.$axios.get('/admin/users', {
								params: vm.route.query
							}).then((response) => {
								vm.$set(vm.user_pagination, "users", response.data);
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
		return $axios.get('/admin/users', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : '',
				role_id: route.query.role_id ? route.query.role_id : 3,
				reseller: route.query.reseller ? route.query.reseller : 0,
				status: route.query.status ? route.query.status : 1
			}
		}).then((response) => {
			return {
				user_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					users: response.data
				},
				filter: {
					role_id: route.query.role_id ? route.query.role_id : 3,
					reseller: route.query.reseller ? route.query.reseller : 0,
					status: route.query.status ? route.query.status : 1
				},
			}
		}).catch((error) => {
		})
	},
	mounted(){
		let vm = this;
		$('[name="role_id"]').select2({
			placeholder: "Select Role"
		}).on('change', function () {
			vm.$set(vm.filter, "role_id", this.value);
		}).val(3).trigger('change');

		$('[name="status"]').select2({
			placeholder: "Select Status"
		}).on('change', function () {
			vm.$set(vm.filter, "status", this.value);
		}).val(1).trigger('change');

		$('#reseller_check').click(function(){
			if($(this).prop("checked") === true){
				vm.$set(vm.filter, "reseller", 1);
			} else {
				vm.$set(vm.filter, "reseller", 0);
			}
		});
	}
}
</script>
