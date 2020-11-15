<template>
	<div class="dashcontent">
		<h1><i class="fa fa-credit-card famore" aria-hidden="true"></i> Billing</h1>
		<div class="dashstuff" v-if="enabledBilling">
			<div class="row">
				<div class="col-md-10 billing">
					<div class="wow fadeIn blocks">
						<div class="row">
							<div class="col-md-8" v-if="invoices.data.length > 0">
								<ul class="nav nav-tabs" role="tablist">
									<li role="presentation" class="active"><a href="#all" aria-controls="overview"
																			  role="tab" data-toggle="tab"><i
										class="fas fa-file-alt" aria-hidden="true"></i>&nbsp; All Invoices</a></li>
								</ul>
								<div class="tab-content">
									<div role="tabpanel" class="wow fadeIn tab-pane active" id="all">
										<div class="table-responsive">
											<table class="table">
												<thead>
												<tr>
													<th>Invoice #</th>
													<th>Invoice date</th>
													<th>Total</th>
													<th>Status</th>
													<th>Action</th>
												</tr>
												</thead>
												<tbody>
												<tr v-for="invoice in invoices.data">
													<td>{{ invoice.number }}</td>
													<td>{{ invoice.created_at }}</td>
													<td>{{ $invoiceCurrency(invoice.total, invoice.currency) }}</td>
													<td>{{ invoice.status }}</td>
													<td>
														<nuxt-link
															:to="{name: 'user-billing-invoice-id', params: {id: invoice.id}}"
															href="#"><span
															class="label label-default">View Invoice</span></nuxt-link>
													</td>
												</tr>
												</tbody>
											</table>
										</div>
										<pagination :search="pagination_search" :pagination="invoices"
													@paginate="page"></pagination>
										<br>
										<br>
									</div>
								</div>
							</div>
							<div class="col-md-8" v-else>
								<div class="alert alert-info text-center">No Invoices Generated</div>
							</div>
							<div class="col-md-4 wb">
								<h3>Summary</h3>
								<div class="circlestats">
									<b> <span class="budget">{{ $currencyFormat(user.credit) }}</span></b> <br/>
									balance
								</div>
								<div class="circlestats">
									<b> <span class="budget">{{ $currencyFormat(user.debit) }}</span></b> <br/>
									charges
								</div>
								<form class="paymentmethod" id="creditForm">
									<h3>Add funds</h3>
									<hr>
									<div class="col-md-12">
										<div class="input-group">
											<span class="input-group-addon">{{
													currencySymbol[environment.settings.currency_code]
												}}</span>
											<input type="number" class="form-control" aria-label="Amount" name="amount">
										</div>
									</div>
									<br/>
									<div class="col-md-6">
										<select name="gateway" class="form-control">
											<option value="paypal">PayPal</option>
											<option value="stripe">Stripe</option>
											<option value="razorpay">Razorpay</option>
										</select>
									</div>
									<div class="col-md-6">
										<button class="btn btn-primary" @click.prevent="addfunds">Add Funds</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="dashstuff" v-else>
			<div class="row">
				<div class="col-md-10 billing">
					<div class="wow fadeIn blocks">
						<div class="alert alert-info text-center">Billing is not enabled!</div>
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
	layout: 'user',
	head: {
		title: 'Billing',
	},
	components: {
		pagination
	},

	data() {
		return {
			getRoute: "user/invoices",
			pagination_search: "",
			pagination_store: {no: 1, items: 10},
			invoices: {
				total: 0,
				data: []
			}
		}
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

		addfunds() {
			let amount = $('[name="amount"]').val();
			if (amount < Math.round(this.$store.getters.settings.minimum_funds, 2)) {
				bootbox.alert("Minimum funds that can be added are " + this.$currencyFormat(this.$store.getters.settings.minimum_funds));
				return;
			}
			let x = window.open('', '', 'height=768px,width=1024px'), vm = this;
			vm.$axios.post('/user/billing/add-credit', $('#creditForm').serialize()).then((response) => {
				x.document.open();
				x.document.write(response.data);
				x.document.close();
			}).catch((error) => {

			})
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
		return $axios.get('user/invoices', {
			params: {
				page: pagination_store.no,
				per_page: pagination_store.items,
				search: pagination_search
			}
		}).then((response) => {
			return {
				invoices: response.data,
				pagination_search: pagination_search,
				pagination_store: pagination_store,
				getRoute: "user/invoices"
			}
		}).catch((error) => {

		});
	},
	mounted() {
		$('.budget').each(function () {
			var el = $(this);
			var textLength = el.html().length;
			if (textLength > 3) {
				el.css('font-size', '17px');
			}
		});
		$('.budget').each(function () {
			var el = $(this);
			var textLength = el.html().length;
			if (textLength > 4) {
				el.css('font-size', '14px');
			}
		});
		$('.budget').each(function () {
			var el = $(this);
			var textLength = el.html().length;
			if (textLength > 5) {
				el.css('font-size', '13px');
			}
		});
		$('.budget').each(function () {
			var el = $(this);
			var textLength = el.html().length;
			if (textLength > 6) {
				el.css('font-size', '11px');
			}
		});
	}
}
</script>
