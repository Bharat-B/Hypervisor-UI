<template>
	<div class="dashcontent">
		<h1><i aria-hidden="true" class="fa fa-plus-circle"></i> Deploy Instance</h1>
		<div class="dashstuff newinstance">
			<div class="row">
				<div class="col-md-9">
					<div class="wow fadeIn blocks">
						<h3>Choose Location</h3>
						<p class="less">Choose a location datacenter for your instance deployment.</p>
						<br/>
						<div id="loc">
							<a v-for="region in all_regions" v-if="region.hidden === 0" :id="'region-'+region.id"
							   href="#" @click.prevent="selectRegion(region)">
								<div :class="{disabled: region.hypervisors.length <= 0 || region.locked, active: region.id === region_id}"
									 class="loc">
									<h4><img :src="'/flags/'+region.country.toLowerCase()+'.png'"> <span>{{ region.name }}</span></h4>
								</div>
							</a>
						</div>
						<br>
						<hr>
						<div class="servertype">
							<div class="ipricing">
								<h3>Server Size</h3>
								<p>Server details & pricing for instance.</p>
								<div class="row">
									<div v-if="all_plans.length >= 1" class="carousel">
										<div v-for="plan in all_plans" :id="'plan-'+plan.id" :class="{'active': plan.id === plan_id}"
											 class="rev col-lg-2" @click="selectPlan(plan)">
											<h4>{{ plan.name }}</h4>
											<hr>
											<p><b>{{ plan.cpu_cores }}</b>vCPU(s)</p>
											<p><b>{{ plan.ram / 1024 }}</b> GB Memory</p>
											<p><b>{{plan.disk_size > 1024 ? plan.disk_size / 1024 + ' TB' : plan.disk_size + ' GB' }}</b> {{ plan.disk_type }} Disk</p>
											<p v-if="plan.bandwidth !== 0"><b>{{ plan.bandwidth }}</b>GB Bandwidth</p>
											<p v-else><b>Unmetered</b> Bandwidth</p>
											<div class="name"><b>{{ $currencyFormat(plan.price) }}</b></div>
										</div>
									</div>
									<div v-else-if="region_id !== '' && region_id !== null && all_plans.length <= 0"
										 class="col-lg-12">
										<div class="alert alert-info">No plans available in this region!</div>
									</div>
									<div v-else class="col-lg-12">
										<div class="alert alert-info">Select a region to explore the plans!</div>
									</div>
								</div>
							</div>
							<br>
							<hr>
							<h3>Server OS</h3>
							<h5 class="less">Specifications & OS setup for your instance.</h5>
							<br>
							<div class="os">
								<div class="tab-content">
									<div id="64os" class="tab-pane active" role="tabpanel">
										<div v-if="errors.iso_id || errors.image_id" class="alert alert-danger">{{
												errors.image_id ? errors.image_id[0] : errors.iso_id ? errors.iso_id[0] : ''
											}}
										</div>
										<div v-if="!plan_has_image && !plan_has_iso" class="row">
											<div class="col-md-3">
												<div class="osnav">
													<ul class="nav nav-tabs nav-justified"
														role="tablist" style="text-align: center !important;">
														<li class="active" role="presentation"><a aria-controls="images"
																								  data-toggle="tab"
																								  href="#images"
																								  role="tab">OS</a>
														</li>
														<li role="presentation"><a aria-controls="iso" data-toggle="tab"
																				   href="#iso" role="tab">ISO</a>
														</li>
													</ul>
												</div>
											</div>
											<div class="col-md-9">
												<div class="tab-content">
													<div id="images" class="tab-pane nos active" role="tabpanel"
														 style="padding: 0px">
														<div v-for="(images,distro,index) in images" v-if="!noimages"
															 :id="'imagedistro-'+distro"
															 id="tableDiv" class="dropdown">
															<img :src="'/assets/'+distro+'.png'" class="osimg"/>
															<button id="tableButton"
																	:class="{active: image_distro === distro}"
																	class="btn btn-default dropdown-toggle"
																	data-toggle="dropdown" type="button">
                                                                <span v-show="image_distro === distro"
																	  :id="distro+'-image_name'">

                                                                </span>
																<span
																	v-show="image_distro !== distro">Select Version</span>
																<span class="caret"></span>
															</button>
															<ul id="tableMenu" class="dropdown-menu">
																<li v-for="image in images"
																	@click.prevent="selectImage(image)"><a href="#">
																	{{ image.name }}</a></li>
															</ul>
														</div>
														<div v-if="noimages" class="alert alert-info">No Images
															available!
														</div>
													</div>
													<div id="iso" class="tab-pane nos" role="tabpanel"
														 style="padding: 0px">
														<div v-for="(isos,distro,index) in isos" v-if="!noisos"
															 :id="'isodistro-'+distro"
															 id="tableDiv2" class="dropdown">
															<img :src="'/assets/'+distro+'.png'" class="osimg"/>
															<button id="tableButton2"
																	:class="{active: iso_distro === distro}"
																	class="btn btn-default dropdown-toggle"
																	data-toggle="dropdown" type="button">
                                                                <span v-show="iso_distro === distro"
																	  :id="distro+'-iso_name'">
                                                                </span>
																<span
																	v-show="iso_distro !== distro">Select Version</span>
																<span class="caret"></span>
															</button>
															<ul id="tableMenu2" class="dropdown-menu">
																<li v-for="iso in isos" @click.prevent="selectISO(iso)">
																	<a href="#"> {{ iso.name }}</a></li>
															</ul>
														</div>
														<div v-if="noisos" class="alert alert-info">No ISO(s)
															available!
														</div>
													</div>
												</div>
											</div>
										</div>
										<div v-else class="row">
											<div class="alert alert-info">Plan already has an Image / ISO assigned to
												it
											</div>
										</div>
									</div>
								</div>
							</div>
							<br><br>
						</div>
						<br>
						<hr>
						<div class="row">
							<div class="col-md-4">
								<h3>Firewall</h3>
								<p class="less">Select a firewall for this instance. </p>
								<select class="form-control" name="firewall_id"></select>
							</div>
							<div class="col-md-4">
								<h3>SSH Key</h3>
								<p class="less">Select a SSH key for this instance. </p>
								<select class="form-control" name="ssh_key_id"></select>
							</div>
							<div class="col-md-4">
								<h3>Recipe</h3>
								<p class="less">Select a recipe for this instance. </p>
								<select class="form-control" name="recipe_id"></select>
							</div>
						</div>
						<br/>
						<br>
						<hr>
						<div class="row">
							<div :class="{'has-error': errors.hostname}" class="col-md-6 form-group">
								<h3>Hostname</h3>
								<p class="less">Write a server hostname & label. </p>
								<input v-model="hostname"
									   class="form-control"
									   name="domain.com" style="height: 50px !important; min-width: 60%; display: inline-block;">
								<span v-if="errors.hostname" class="help-block">{{ errors.hostname[0] }}</span>
							</div>
						</div>
					</div>
				</div>
				<div v-if="plan_id" class="col-md-3">
					<div class="blocks pinstance animated slideInUp">
						<h3>Total Amount:</h3>
						<h2><b v-for="plan in all_plans" v-if="plan_id === plan.id">{{
								$currencyFormat(plan.price)
							}}</b> / mo*
							<span v-for="plan in all_plans"
								  v-if="plan_id === plan.id">or {{ $currencyFormat(plan.price / 744, 4) }} / hr</span>.
						</h2>
						<a href="#" @click.prevent="create">
							<button class="btn btn-default">
								<i aria-hidden="true" class="fa fa-rocket"></i>
								<span v-if="!deploying">Deploy</span>
								<span v-else>Deploying</span>
							</button>
						</a>
						<p class="less">* You will be charged hourly and you can terminate the instance any time.</p>
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
		title: 'Create Instance',
		script: [
			{src: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.5.8/slick.min.js'}
		],
		link: [
			{rel: 'stylesheet', href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.5.8/slick.min.css"},
			{rel: 'stylesheet', href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.5.8/slick-theme.min.css"}
		]
	},
	validate({params, query, store, redirect}) {
		if (store.state.auth.user.is_reseller === 1) {
			return redirect('/user/instance/reseller-create');
		}
		if (store.state.global.environment.settings.enable_billing === '1') {
			return true;
		}
	},
	data() {
		return {
			all_regions: [],
			all_images: [],
			all_isos: [],
			regions: {},
			images: {},
			isos: {},
			all_plans: [],
			plans: [],
			ssh_keys: [],
			recipes: [],
			image_distro: null,
			region_id: null,
			plan_id: null,
			image_id: null,
			iso_id: null,
			iso_distro: null,
			ssh_key_id: null,
			recipe_id: null,
			hostname: null,
			deploying: false,
			plan_has_image: false,
			plan_has_iso: false,
			noisos: true,
			noimages: true,
			instance: {image_id: '', iso_id: ''},
			slickOptions: {
				slidesToShow: 4,
				autoplay: false,
				autoplaySpeed: 4000,
				infinite: false,
				lazyLoad: 'ondemand',
				focusOnSelect: false,
				responsive: [
					{
						breakpoint: 769,
						settings: 'unslick'
					}
				]
			}
		}
	},

	async asyncData({$axios}) {
		let images = {}, regions = {}, plans = [], plan_ids = [], all_regions = [], isos = {}, all_images = [],
			all_isos = [];

		let imageresponse = await $axios.get('user/images').catch((error) => {
		});
		imageresponse.data.data.forEach((image) => {
			if (!images[image.distro]) {
				images[image.distro] = [];
			}
			images[image.distro].push(image);
			all_images.push(image);
		});
		if (imageresponse.data.last_page !== 1) {
			for (let i = 2; i <= imageresponse.data.last_page; i++) {
				imageresponse = await $axios.get('user/images', {params: {page: i}}).catch((error) => {
				});
				imageresponse.data.data.forEach((image) => {
					if (!images[image.distro]) {
						images[image.distro] = [];
					}
					images[image.distro].push(image);
					all_images.push(image);
				});
			}
		}

		let isoresponse = await $axios.get('user/isos').catch((error) => {
		});
		isoresponse.data.data.forEach((iso) => {
			if (!isos[iso.distro]) {
				isos[iso.distro] = [];
			}
			isos[iso.distro].push(iso);
			all_isos.push(iso)
		});
		if (isoresponse.data.last_page !== 1) {
			for (let i = 2; i <= isoresponse.data.last_page; i++) {
				isoresponse = await $axios.get('user/isos', {params: {page: i}}).catch((error) => {
				});
				isoresponse.data.data.forEach((image) => {
					if (!images[iso.distro]) {
						images[iso.distro] = [];
					}
					isos[iso.distro].push(iso);
					all_isos.push(iso)
				});
			}
		}

		let regionresponse = await $axios.get('user/regions').catch((error) => {
		});
		regionresponse.data.data.forEach((region) => {
			if (!regions[region.country]) {
				regions[region.country] = [];
			}
			if (region.hidden === 0) {
				all_regions.push(region);
				regions[region.country].push(region);
				region.plans.forEach((plan) => {
					if (plan_ids.indexOf(plan.id) === -1) {
						plans.push(plan);
						plan_ids.push(plan.id);
					}
				})
			}
		});
		if (regionresponse.data.last_page !== 1) {
			for (let i = 2; i <= regionresponse.data.last_page; i++) {
				regionresponse = await $axios.get('user/regions', {params: {page: i}}).catch((error) => {
				});
				regionresponse.data.data.forEach((region) => {
					if (!regions[region.country]) {
						regions[region.country] = [];
					}
					if (region.hidden === 0) {
						all_regions.push(region);
						regions[region.country].push(region);
						region.plans.forEach((plan) => {
							if (plan_ids.indexOf(plan.id) === -1) {
								plans.push(plan);
								plan_ids.push(plan.id);
							}
						})
					}
				});
			}
		}


		return {
			images: images,
			plans: plans,
			plans_ids: plan_ids,
			regions: regions,
			all_regions: all_regions,
			isos: isos,
			noimages: all_images.length <= 0,
			noisos: all_isos.length <= 0
		};
	},
	watch: {
		region_id(val) {
			this.$set(this, "plans", []);
			this.all_regions.forEach((region) => {
				if (region.id === val) {
					this.$set(this, "all_plans", region.plans);
					this.$nextTick(() => {
						var carousel = $('.carousel');
						if (carousel.hasClass('slick-slider')) {
							carousel.slick('unslick');
						}
						carousel.slick(this.slickOptions)
					});
				}
			});
		},
	},
	methods: {
		selectImage(image) {
			this.$set(this, 'image_distro', image.distro);
			this.$set(this, 'image_id', image.id);
			$('#' + image.distro + '-image_name').text(image.name);
			this.$set(this, 'iso_distro', null);
			this.$set(this, 'iso_id', null);
		},
		selectISO(iso) {
			this.$set(this, 'iso_distro', iso.distro);
			this.$set(this, 'iso_id', iso.id);
			$('#' + iso.distro + '-iso_name').text(iso.name);
			this.$set(this, 'image_distro', null);
			this.$set(this, 'image_id', null);
		},
		selectRegion(region) {
			if (region.locked !== 1 && region.hypervisors.length >= 1) {
				this.$set(this, "region_id", region.id);
			}
		},
		selectPlan(plan) {
			this.$set(this, 'plan_id', plan.id);
			console.log('plan ' + JSON.stringify(plan.image_id))
			if (plan.image_id !== "0" && plan.image_id !== "") {
				this.$set(this, "plan_has_image", true);
			}
		},
		async create() {
			let vm = this, params = {
				region_id: vm.region_id,
				image_id: vm.image_id,
				iso_id: vm.iso_id,
				plan_id: vm.plan_id,
				ssh_key_id: vm.ssh_key_id,
				recipe_id: vm.recipe_id,
				hostname: vm.hostname
			};
			vm.deploying = true;
			let response = await this.$axios.post('user/instances', params).catch((error) => {
				vm.deploying = false;
			});
			if (!response) {
				vm.deploying = false;
			} else {
				if (response.data.task_id) {
					vm.deploying = false;
					vm.$router.replace({name: 'user-dashboard'});
				}
			}
		}
	},
	mounted() {
		let vm = this;
		$(document).ready(function () {
			$('.js-example-basic-single').select2({});
			var carousel = $('.carousel');
			if (carousel.hasClass('slick-slider')) {
				carousel.slick('unslick');
			}
			carousel.slick(this.slickOptions);
		});
		new WOW().init(
			{
				boxClass: 'wow',
				animateClass: 'animated',
				offset: 0,
				mobile: false,
				live: true
			}
		);

		$(function () {
			$('[data-toggle="tooltip"]').tooltip()
		});

		$("#tableMenu2 a").click(function (e) {
			e.preventDefault(); // cancel the link behaviour
			var selText = $(this).text();
			$("#tableButton2").text(selText);
		});
		$("#tableMenu3 a").click(function (e) {
			e.preventDefault(); // cancel the link behaviour
			var selText = $(this).text();
			$("#tableButton3").text(selText);
		});
		$('[name="firewall_id"]').select2({
			allowClear: true,
			placeholder: 'Select Firewall',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/user/firewalls',
				headers: {
					"Authorization": window.localStorage.getItem('auth._token.local'),
					"X-Requested-With": 'XMLHttpRequest',
					"Content-Type": "application/json",
				},
				dataType: 'json',
				delay: 250,
				data: function (params) {
					return {
						search: $.trim(params.term),
					}
				},
				processResults: function (data) {
					let firewalls = [];
					data.data.forEach((firewall) => {
						firewalls.push({id: firewall.id, text: firewall.name, firewall: firewall});
					});
					return {
						results: firewalls
					}
				},
				cache: true
			}
		}).on('change', function () {
			vm.$set(vm, "firewall_id", $(this).val());
		});
		$('[name="ssh_key_id"]').select2({
			allowClear: true,
			placeholder: 'Select Key',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/user/ssh-keys',
				headers: {
					"Authorization": window.localStorage.getItem('auth._token.local'),
					"X-Requested-With": 'XMLHttpRequest',
					"Content-Type": "application/json",
				},
				dataType: 'json',
				delay: 250,
				data: function (params) {
					return {
						search: $.trim(params.term),
					}
				},
				processResults: function (data) {
					let keys = [];
					data.data.forEach((key) => {
						keys.push({id: key.id, text: key.name, ssh_key: key});
					});
					return {
						results: keys
					}
				},
				cache: true
			}
		}).on('change', function () {
			vm.$set(vm, "ssh_key_id", $(this).val());
		});
		$('[name="recipe_id"]').select2({
			allowClear: true,
			placeholder: 'Select Recipe',
			ajax: {
				url: vm.$axios.defaults.baseURL + '/user/recipes',
				headers: {
					"Authorization": window.localStorage.getItem('auth._token.local'),
					"X-Requested-With": 'XMLHttpRequest',
					"Content-Type": "application/json",
				},
				dataType: 'json',
				delay: 250,
				data: function (params) {
					return {
						search: $.trim(params.term),
					}
				},
				processResults: function (data) {
					let recipes = [];
					data.data.forEach((recipe) => {
						recipes.push({id: recipe.id, text: recipe.name, recipe: recipe});
					});
					return {
						results: recipes
					}
				},
				cache: true
			}
		}).on('change', function () {
			vm.$set(vm, "recipe_id", $(this).val());
		});
	}
}
</script>
