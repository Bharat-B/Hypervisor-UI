<template>
	<div class="apage">
		<div class="container">
			<br/><br/>
			<nuxt-link :to="{name: 'user-billing'}"><i class="fa fa-angle-left" aria-hidden="true"></i> Back to Invoices
			</nuxt-link>
			<br/><br/>
			<div class="invoice">
				<h2 class="id less">Invoice #{{ invoice.number }}</h2>
				<h3 class="statusi" @click.prevent="window.print()"><a href="#"><span class="label label-primary"><i
					class="fa fa-print" aria-hidden="true"></i> Print</span></a></h3>
				<div class="invoices">
					<div class="row details">
						<div class="col-md-8">
							<img :src="environment.settings.company_logo"/>
							<p><b>Tax ID:</b> {{ environment.settings.tax_id }}</p>
							<p><b>Phone:</b> +{{ countryPhoneList[environment.settings.country] }}
								{{ environment.settings.phone }}</p>
							<p><b>Address:</b> {{ environment.settings.address }} <br/></p>
							<p><b>State:</b> {{ environment.settings.state }} <br/></p>
							<p><b>Country:</b> {{ environment.settings.country }} <br/></p>

						</div>
						<div class="col-md-4 clientd">
							<h4><i class="fa fa-info-circle less" aria-hidden="true"></i> Your details:</h4>
							<p><b>Name:</b> {{ user.first_name }} {{ user.last_name }}</p>
							<p><b>Phone:</b> +{{ countryPhoneList[user.country] }} {{ user.phone }}</p>
							<p><b>Address:</b> {{ user.address }}</p>
							<p><b>State:</b> <span v-for="state in countryStates[user.country]"
												   v-if="state.code === user.state"> {{ state.name }}</span> <br/></p>
							<p><b>Country:</b> {{ user.country }} <br/></p>
						</div>
					</div>
					<div class="table-responsive">
						<table class="table">
							<thead>
							<tr>
								<th>Description</th>
								<th v-if="invoice.type !== 'credit'">No. of hours</th>
								<th v-else>Cost</th>
								<th v-if="invoice.type !== 'credit'">Cost Per Hour</th>
								<th v-else>Tax</th>
								<th>Total</th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="item in invoice.items">
								<td>{{ item.type }} - {{ item.description }}</td>
								<td v-if="invoice.type !== 'credit'">{{ item.hours }}</td>
								<td v-else>{{ $invoiceCurrency(item.amount, invoice.currency) }}</td>
								<td v-if="invoice.type !== 'credit'">
									{{ $invoiceCurrency(item.amount / item.hours, invoice.currency) }}
								</td>
								<td v-else>{{ $invoiceCurrency(item.tax, invoice.currency) }}</td>
								<td>{{ $invoiceCurrency(item.total, invoice.currency) }}</td>
							</tr>
							<tr>
								<td></td>
								<td></td>
								<td><b>Subtotal</b></td>
								<td>{{ $invoiceCurrency(invoice.subtotal, invoice.currency) }}</td>
							</tr>
							<tr>
								<td></td>
								<td></td>
								<td><b>Tax</b></td>
								<td>{{ $invoiceCurrency(invoice.tax, invoice.currency) }}</td>
							</tr>
							<tr>
								<td></td>
								<td></td>
								<td><b>Total</b></td>
								<td>{{ $invoiceCurrency(invoice.total, invoice.currency) }}</td>
							</tr>
							</tbody>
						</table>
					</div>
					<div class="table-responsive" v-if="invoice.payment && invoice.payment.id">
						<table class="table white b-a">
							<thead>
							<tr>
								<th>Transaction Date</th>
								<th>Transaction ID</th>
								<th v-if="invoice.status === 'refunded'">Refund ID</th>
								<th>Amount</th>
								<th>Payment Gateway</th>
								<th>Status</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td>{{ invoice.payment.created_at }}</td>
								<td>{{ invoice.payment.txn_id }}</td>
								<td v-if="invoice.status === 'refunded'">{{ invoice.payment.refund_id }}</td>
								<td>{{ $invoiceCurrency(invoice.payment.income, invoice.payment.currency) }}</td>
								<td>{{ invoice.payment.gateway }}</td>
								<td>{{ invoice.payment.status }}</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	layout: 'user',
	head: {
		title: 'Show Invoice',
	},
	watch: {},
	data() {
		return {
			invoice: {}
		}
	},
	methods: {},
	asyncData({$axios, params}) {
		return $axios.get('user/invoices/' + params.id).then((response) => {
			return {invoice: response.data}
		}).catch((error) => {

		});
	},
	mounted() {

	},
	created() {

	}
}
</script>
