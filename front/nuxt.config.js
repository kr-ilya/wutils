const colors = require('vuetify/es5/util/colors').default
const pkg = require('./package')

module.exports = {
  mode: 'universal',
  cache: true,
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'keywords', name: 'keywords', content: 'ip, ip-адрес, местоположение, порт, сканер, punycode, цвет пикселя по фото, скачать фото и видео с инстраграма, инстаграм, скачать, инструменты, онлайн, бесплатно, веб, web, утилиты, все инструменты' },
      { name: 'msapplication-TileColor', content: '#2b5797' },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon',  sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon',  type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon',  type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest',  href: '/site.webmanifest' },
      { rel: 'mask-icon',  href: '/safari-pinned-tab.svg', color: '#656f72' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#1867c0', height: '3px' },
  /*
  ** Global CSS
  */
  css: [
  	'~/assets/misc.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify' //разбкомменторивать для продакшн
  ],
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    'nuxt-clipboard2',
    ['@nuxtjs/yandex-metrika',
      {
        id: '',
        webvisor: true,
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
    }],
    ['@nuxtjs/google-analytics', {
      id: ''
    }],
  ],

  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    },
    defaultAssets: {
      icons: false //разбкомменторивать для продакшн
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
