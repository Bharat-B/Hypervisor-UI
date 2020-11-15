<template>
	<div class="content animated fadeId">
		<h2><i class="fa fa-credit-card"></i>Invoices</h2>
		<div class="col-md-10 email">
			<div class="box">
				<div class="table-responsive">
					<table class="table text-center">
						<thead>
						<tr>
							<th class="text-center">Invoice #</th>
							<th class="text-center">Date</th>
							<th class="text-center">User</th>
							<th class="text-center">Total</th>
							<th class="text-center">Status</th>
							<th class="text-center">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="invoice in invoice_pagination.invoices.data">
							<td>{{ invoice.number }}</td>
							<td>{{ invoice.created_at }}</td>
							<td>
								<nuxt-link :to="{name: 'admin-user-id', params:{ id: invoice.user_id }}">
									{{ invoice.user.email }}
								</nuxt-link>
							</td>
							<td>{{ $invoiceCurrency(invoice.total, invoice.currency) }}</td>
							<td>{{ invoice.status }}</td>
							<td></td>
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
	head: {title: 'Invoices'},
	data() {
		return {
			invoice_pagination: {
				page: 1,
				per_page: 20,
				invoices: {
					data: [],
					total: 0
				},
				search: ""
			}
		}
	},
	async asyncData({$axios, route}) {
		let response = await $axios.get('/admin/invoices', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : '',
			}
		});
		return {
			transaction_pagination: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : '',
				invoices: response.data
			}
		}
	},
	mounted() {

	}
}
</script>
