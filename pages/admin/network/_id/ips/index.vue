<template>
	<div class="content animated fadeIn">
		<h2><i class="fa fa-server" aria-hidden="true"></i>Network IP(s)</h2>
		<div class="col-md-10 email networks">
			<div class="box">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search.." v-model="ip_pagination.search"
						   @keyup.enter="search">
				</div>
				<div class="pull-right createit">
					<nuxt-link tag="button" :to="{name: 'admin-network-create'}" class="btn btn-primary"><i
						class="fa fa-plus" aria-hidden="true"></i>&nbsp; Add network
					</nuxt-link>
					<nuxt-link tag="button" :to="{name: 'admin-network-create'}" class="btn btn-primary"><i
						class="fa fa-plus" aria-hidden="true"></i>&nbsp; Add IPv4
					</nuxt-link>
					<nuxt-link tag="button" :to="{name: 'admin-network-create'}" class="btn btn-primary"><i
						class="fa fa-plus" aria-hidden="true"></i>&nbsp; Add IPv6
					</nuxt-link>
				</div>
				<div class="table-responsive">
					<table class="table">
						<thead>
						<tr>
							<th>IP</th>
							<th>MAC</th>
							<th>Instance</th>
							<th>Network</th>
							<th>Reserved</th>
							<th class="actions">Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="(ip,$index) in ip_pagination.ips.data">
							<td>{{ ip.ip }}{{ ip.version === 'v6_subnet' ? '/' + ip.ip_mask : '' }}</td>
							<td>
								<span v-if="!ip.editing">{{ ip.mac !== '' ? ip.mac : 'Not Assigned' }} <i
									class="fas fa-edit" style="cursor:pointer"
									@click.prevent="$set($data.ip_pagination.ips.data[$index],'editing',true)"></i></span>
								<span v-if="ip.editing">
                                    <div class="input-group">
                                        <input type="text" class="form-control" placeholder="00:16:3e:59:8b:f8"
											   v-model="ip.mac">
                                        <div class="input-group-addon">
                                            <button class="btn" type="button" @click.prevent="update_mac(ip,$index)"
													:disabled="ip.update_processing">
                                                <i class="fa fa-spin fa-spinner" v-if="ip.update_processing"></i>
                                                <i class="fas fa-check" v-else></i>
                                            </button>
                                        </div>
                                    </div>
                                </span>
							</td>
							<td>{{ ip.instance ? ip.instance.name : 'Not Assigned' }}</td>
							<td>{{ ip.network.name }}</td>
							<td>
								<div>
									<input type="checkbox" :id="'is_reserved_'+ip.id" v-model="ip.reserved" value="1"
										   :checked="ip.reserved === 1" @change.prevent="update_reserved(ip)"/>
									<label class="switchy" :for="'is_reserved_'+ip.id"></label>
								</div>
							</td>
							<td class="actions">
								<nuxt-link tag="a" :to="{name: 'admin-network-id', params:{id: ip.id}}"
										   class="btn btn-default"><i class="fa fa-edit" aria-hidden="true"></i>
								</nuxt-link>
								<button class="btn btn-default"><i class="fa fa-trash" aria-hidden="true"></i></button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div class="ipages">
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> {{ ip_pagination.per_page }} entries
						</button>
						<ul class="dropdown-menu">
							<li :class="{active: ip_pagination.per_page === 20}"><a href="#"
																					@click.prevent="$set($data.ip_pagination,'per_page',20)">20
								entries</a></li>
							<li :class="{active: ip_pagination.per_page === 50}"><a href="#"
																					@click.prevent="$set($data.ip_pagination,'per_page',50)">50
								entries</a></li>
							<li :class="{active: ip_pagination.per_page === 100}"><a href="#"
																					 @click.prevent="$set($data.ip_pagination,'per_page',100)">100
								entries</a></li>
						</ul>
					</div>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"> Page {{ ip_pagination.ips.current_page }}
							<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu">
							<li v-for="i in $pageRange(ip_pagination.ips.last_page)">
								<a href="#" @click.prevent="$set($data.ip_pagination,'page',i)">
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
		title: 'Show IP(s)'
	},
	watchQuery: true,
	watch: {
		'ip_pagination.page': function () {
			this.search();
		},
		'ip_pagination.per_page': function () {
			this.search();
		}
	},
	data() {
		return {
			ip_pagination: {
				page: 1,
				per_page: 20,
				ips: {
					data: [],
					total: 0
				},
				search: ""
			},
			network: {},
		}
	},
	methods: {
		update_mac(ip, index) {
			this.$set(this.ip_pagination.ips.data[index], "update_processing", true);
			this.$axios.patch('/admin/ips/' + ip.id, {mac: ip.mac}).then((response) => {
				this.$set(this.ip_pagination.ips.data[index], "update_processing", false);
				this.$set(this.ip_pagination.ips.data[index], "editing", false);
			}).catch((error) => {
				this.$set(this.ip_pagination.ips.data[index], "update_processing", false);
				this.$set(this.ip_pagination.ips.data[index], "editing", true);
			});
		},
		update_reserved(ip) {
			this.$axios.patch('/admin/ips/' + ip.id, {reserved: ip.reserved});
		},
		async search() {
			this.$router.replace({
				name: this.$route.name,
				params: {
					id: this.$route.params.id
				},
				query: {
					page: this.ip_pagination.page,
					per_page: this.ip_pagination.per_page,
					search: this.ip_pagination.search
				}
			})
		},
	},
	async asyncData({$axios, route}) {
		return $axios.get('/admin/networks/' + route.params.id + '/ips', {
			params: {
				page: route.query.page ? route.query.page : 1,
				per_page: route.query.per_page ? route.query.per_page : 20,
				search: route.query.search ? route.query.search : ''
			}
		}).then((response) => {
			return {
				ip_pagination: {
					page: route.query.page ? route.query.page : 1,
					per_page: route.query.per_page ? route.query.per_page : 20,
					search: route.query.search ? route.query.search : '',
					ips: response.data
				},
			}
		}).catch((error) => {
		})
	},
	created() {
	},
	mounted() {

	}
}
</script>
