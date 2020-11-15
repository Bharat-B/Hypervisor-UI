<template>
	<div class="content animated fadeId">
		<h2><i class="fa fa-credit-card"></i>Payments</h2>
		<div class="col-md-10 email">
			<div class="box">
				<div class="table-responsive">
					<table class="table text-center">
						<thead>
						<tr>
							<th class="text-center">Transaction #</th>
							<th class="text-center">Invoice #</th>
							<th class="text-center">User</th>
							<th class="text-center">Refund #</th>
							<th class="text-center">Gateway</th>
							<th class="text-center">Income</th>
							<th class="text-center">Fee</th>
							<th class="text-center">Status</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="payment in payment_pagination.payments.data">
							<td>{{ payment.txn_id }}</td>
							<td>{{ payment.invoice_id }}</td>
							<td>
								<nuxt-link :to="{name: 'admin-user-id', params:{ id: payment.user_id }}">
									{{ payment.user.email }}
								</nuxt-link>
							</td>
							<td>{{ payment.refund_id }}</td>
							<td>{{ payment.gateway }}</td>
							<td>{{ $invoiceCurrency(payment.income, payment.currency) }}</td>
							<td>{{ $invoiceCurrency(payment.fees, payment.currency) }}</td>
							<td>{{ $invoiceCurrency(payment.status, payment.currency) }}</td>
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
	head: {title: 'Payments'},
	data() {
		return {
			payment_pagination: {
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
		let response = await $axios.get('/admin/payments', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
			}
		});
		return {
			payment_pagination: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				payments: response.data
			}
		}
	},
	mounted() {

	}
}
</script>
