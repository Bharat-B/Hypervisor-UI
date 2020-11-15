const webpack = require("webpack");

export default {
    mode: 'universal',
    /*
    ** Headers of the page
    */
    head: {
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: { color: 'black' },
    /*
    ** Global CSS
    */
    css: [
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '~plugins/mixins/global.js',
        '~plugins/axios',
        '~plugins/custom',
        '~plugins/vue-chartkick',
    ],
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        '@nuxtjs/auth',
        '@nuxtjs/axios'
    ],

    publicRuntimeConfig: {
        API_URL: process.env.API_URL || '/api/v1',
    },

    privateRuntimeConfig: {
        LISTEN_IP: process.env.LISTEN_IP || '127.0.0.1',
        LISTEN_PORT: process.env.LISTEN_PORT || 3000,
        REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
        REDIS_PORT: process.env.REDIS_PORT || 6379,
        REDIS_USER: process.env.REDIS_USER,
        REDIS_USERPWD: process.env.REDIS_USERPWD
    },

    /*
    ** Nuxt Auth
    */
    auth: {
        strategies: {
            local: {
                scheme: 'refresh',
                token: {
                    property: 'token',
                    maxAge: 60 * 60,
                    type: 'Bearer'
                },
                refreshToken: {
                    property: 'refresh_token',
                    data: 'refresh_token',
                    maxAge: 20160 * 60
                },
                user: {
                    property: 'user'
                },
                endpoints: {
                    login: {url: '/auth', method: 'post'},
                    refresh: {url: '/auth/refresh', method: 'post'},
                    user: {url: '/auth/check', method: 'get'},
                    logout: {url: '/auth/invalidate', method: 'post'}
                },
            }
        },
        redirect: {
            login: '/login',
            home: '/',
            logout: '/login',
            callback: '/login'
        },
        fullPathRedirect: true,
        watchLoggedIn: true,
        resetOnError: true,
        plugins: [
            '~/plugins/auth',
        ],
    },

    /*
    ** Build configuration
    */
    build: {



        /*
        ** You can extend webpack config here
        */
        extend (config, ctx) {
        },


		plugins: [
			new webpack.ProvidePlugin({

			})
		],
    },

    /*
    ** Server configuration
     */
    server: {
        port: process.env.PORT || 3000, // default: 3000
        host: process.env.IPADDR || '127.0.0.1' // default: localhost
    }
}
