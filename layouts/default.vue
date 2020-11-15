<template>
    <div>
      <alert v-if="alerts.has && $route.name !== 'forgot-verify-id' && $route.name !== 'signup-verify-id'" :type="alerts.type === 'success' ? 'info' : 'danger'" :position="alerts.position" :message="alerts.message"></alert>
      <nuxt />
    </div>
</template>

<script>
  import alert from '~/components/alert.vue'
  export default {
    components: {
        alert
    },
    head: {
      script: [
		  {src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js'},
		  {src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js'},
		  { src: 'https://cdn.jsdelivr.net/npm/apexcharts@latest'},
		  {src: '/js/bootstrap.js'},
		  {src: '/js/custom.js'},
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
        },
        {rel: 'stylesheet', href: '/css/global.css'},
        {rel: 'stylesheet', href: '/css/animate.css'},
      ]
    },
    mounted(){
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
