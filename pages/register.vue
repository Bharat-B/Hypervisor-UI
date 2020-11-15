<template>
	<div class="logins">
		<div id="particles-js"></div>
		<img class="authlogo" src="" alt=""/>
		<div class="animated fadeIn auth">
			<div class="authcon">
				<h3> Register </h3>
				<form class="form-signin" @submit.prevent="register">
					<div class="form-group">
						<input type="text" class="form-control input-lg" name="first_name" placeholder="First Name"
							   autofocus=""/>
						<span class="help-block" v-if="errors.first_name">{{ errors.first_name[0] }}</span>
					</div>
					<div class="form-group">
						<input type="text" class="form-control input-lg" name="last_name" placeholder="Last Name"
							   autofocus=""/>
						<span class="help-block" v-if="errors.last_name">{{ errors.last_name[0] }}</span>
					</div>
					<div class="form-group">
						<input type="email" class="form-control input-lg" name="email" placeholder="Email Address"
							   autofocus=""/>
						<span class="help-block" v-if="errors.email">{{ errors.email[0] }}</span>
					</div>
					<div class="form-group">
						<input type="password" class="form-control input-lg" name="password" placeholder="Password"/>
						<span class="help-block" v-if="errors.password">{{ errors.password[0] }}</span>
					</div>
					<div class="form-group">
						<input type="password" class="form-control input-lg" name="password_confirmation"
							   placeholder="Password Confirmation"/>
						<span class="help-block" v-if="errors.password_confirmed">{{
								errors.password_confirmed[0]
							}}</span>
					</div>
					<br/>
					<button class="btn btn-lg btn-primary btn-block" :class="{'disabled': processing}" type="submit"
							:disabled="processing">
						<i class="fas" :class="{'fa-sign-in-alt': !processing, 'fa-spinner fa-spin': processing}"
						   aria-hidden="true"></i>&nbsp;
						<span v-if="processing">Processing</span>
						<span v-else>Register</span>
					</button>
					<br/>
					<nuxt-link :to="{name: 'login'}">Login Here</nuxt-link>
					<nuxt-link :to="{name: 'forgot-password'}" class="forgot">Forgot Password?</nuxt-link>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	middleware: 'guest',
	layout: 'default',
	head: {
		title: 'Register',
	},
	beforeCreate() {
		if (!this.$store.getters.environment.settings.enable_billing === '1') {
			this.$router.push({name: 'login'})
		}
	},
	data() {
		return {
			form: {
				email: '',
				password: ''
			},
			dashboard: false,
			processing: false
		}
	},
	methods: {
		async register() {
			this.$axios.post('/signup', $('form').serialize())
				.then((response) => {

				}).catch((error) => {

			});
		}
	},
	mounted() {
		new WOW().init();
		particlesJS('particles-js', {
			"particles": {
				"number": {
					"value": 110,
					"density": {
						"enable": true,
						"value_area": 500
					}
				},
				"color": {
					"value": "#A59EDD"
				},
				"shape": {
					"type": "circle",
					"stroke": {
						"width": 0,
						"color": "#000000"
					},
					"polygon": {
						"nb_sides": 5
					},
					"image": {
						"src": "img/github.svg",
						"width": 100,
						"height": 100
					}
				},
				"opacity": {
					"value": 1,
					"random": true,
					"anim": {
						"enable": true,
						"speed": 1,
						"opacity_min": 0,
						"sync": false
					}
				},
				"size": {
					"value": 3,
					"random": true,
					"anim": {
						"enable": false,
						"speed": 4,
						"size_min": 0.3,
						"sync": false
					}
				},
				"line_linked": {
					"enable": false,
					"distance": 150,
					"color": "#ffffff",
					"opacity": 0.7,
					"width": 1
				},
				"move": {
					"enable": true,
					"speed": 1,
					"direction": "none",
					"random": true,
					"straight": false,
					"out_mode": "out",
					"bounce": false,
					"attract": {
						"enable": false,
						"rotateX": 600,
						"rotateY": 600
					}
				}
			},
			"interactivity": {
				"detect_on": "canvas",
				"events": {
					"onhover": {
						"enable": true,
						"mode": "bubble"
					},
					"onclick": {
						"enable": true,
						"mode": "repulse"
					},
					"resize": true
				},
				"modes": {
					"grab": {
						"distance": 400,
						"line_linked": {
							"opacity": 1
						}
					},
					"bubble": {
						"distance": 250,
						"size": 0,
						"duration": 2,
						"opacity": 0,
						"speed": 2
					},
					"repulse": {
						"distance": 400,
						"duration": 0.4
					},
					"push": {
						"particles_nb": 4
					},
					"remove": {
						"particles_nb": 2
					}
				}
			},
			"retina_detect": true
		});
	}
}
</script>
