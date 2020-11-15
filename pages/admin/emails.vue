<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-server" aria-hidden="true"></i> Emails</h2>
		<div class="col-md-10 email emails">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.." v-model="email_pagination.search"
						   @keyup.enter="search">
				</div>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>Name</th>
							<th>Identifier</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="email in email_pagination.emails.data">
							<td>{{ email.name }}</td>
							<td>{{ email.identifier }}</td>
							<td class="actions">
								<nuxt-link tag="a" :to="{name: 'admin-email-id', params:{ id: email.id } }"
										   class="btn btn-default"><i
									class="fa fa-edit" aria-hidden="true"></i></nuxt-link>
								<button class="btn btn-default" @click.prevent="preview(email)"><i
									class="fas fa-eye"></i></button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="ipages">
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"> {{ email_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: email_pagination.per_page === 20}"><a href="#"
																					   @click.prevent="$set($data.email_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: email_pagination.per_page === 50}"><a href="#"
																					   @click.prevent="$set($data.email_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: email_pagination.per_page === 100}"><a href="#"
																						@click.prevent="$set($data.email_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"> Page {{ email_pagination.emails.current_page }}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(email_pagination.emails.last_page)">
								<a href="#" @click.prevent="$set($data.email_pagination,'page',i)">
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
	head: {
		title: 'Email Templates'
	},
	layout: 'admin',
	watchQuery: true,

	data() {
		return {
			email_pagination: {
				page: 1,
				per_page: 20,
				emails: {
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
				name: this.$route.name, query: {
					page: this.email_pagination.page,
					per_page: this.email_pagination.per_page,
					search: this.email_pagination.search
				}
			})
		},
		preview(email) {
			let x = window.open('', '', 'height=768px,width=1024px');
			x.document.open();
			x.document.write(email.message);
			x.document.close();
		}
	},
	asyncData({$axios, route}) {
		return $axios.get('/admin/emails', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				email_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					emails: response.data
				},
			}
		}).catch((error) => {
		})
	}
}
</script>
