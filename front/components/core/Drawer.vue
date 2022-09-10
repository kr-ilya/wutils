<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    touchless
    floating
    persistent
    :mini-variant="mini"
    mobile-break-point="600"
    width="200"
    mini-variant-width="55"
  >
    <v-list-item
      nuxt
      router
      exact
      no-prefetch
      to='/'
      active-class="logoActiv"
      :class="mini ? 'miniAvatar drawerListLogo' : 'drawerListLogo'"
    >
      <v-list-item-avatar
        :item="false"
        :size=" mini ? 30 : 50"
        color="grey lighten-4"
        :class="mini ? 'miniLogo' : '' ">
        <v-img
          :src="logo"
          height="50"/>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="title">Wutils</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>

      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        nuxt
        router
        exact
        no-prefetch
        active-class="drawer-list-active"
        class="item-p allHeight"
      >
        <v-list-item-icon>
          <v-icon :class="mini ? 'miniIcon' : '' ">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="DrListTitle">{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        to="/instagrab"
        nuxt
        router
        exact
        no-prefetch
        active-class="drawer-list-active"
        class="item-p inst"
      >
        <v-list-item-icon>
          <v-icon :class="mini ? 'miniIcon' : '' ">mdi-package-down</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="instagrab DrListTitle">{{ titleins }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  data: () => ({
    titleins: 'Скачать фото и видео с \n Instagram',
    logo: 'logo.png',
    mini: false,
      items: [
        {
          icon: 'mdi-ip',
          title: 'Узнать IP-адрес',
          to: '/'
        },
        {
          icon: 'mdi-format-text-rotation-none',
          title: 'Punycode конвертер',
          to: '/punycoder'
        },
        {
          icon: 'mdi-access-point-network',
          title: 'Сканер портов',
          to: '/ports'
        },
        {
          icon: 'mdi-select-color',
          title: 'Цвет пикселя на фото',
          to: '/pixels'
        },
        {
          icon: 'mdi-monitor-screenshot',
          title: 'Снимок сайта',
          to: '/siteshot'
        },
        {
          icon: 'mdi-code-tags-check',
          title: 'Минификатор кода',
          to: '/minifier'
        },
        {
          icon: 'mdi-qrcode',
          title: 'Генератор QR кодов',
          to: '/qr'
        }
      ]
    }),

  computed: {
    inputValue: {
      get () {
        return this.$store.state.drawer
      },
      set (val) {
        this.SET_DRAWER(val)
      }
    },
    minit (){
      return this.$store.state.mini
    }
  },

  watch: {
     titlee (title) {
       this.title = title
    },
    minit(mini){
      this.mini = mini
    }
  },

  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    ...mapMutations(['SET_DRAWER', 'TOGGLE_DRAWER']),
    onResponsiveInverted () {
      if (window.innerWidth < 600) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  }
}
</script>

<style>
  .v-list-item__action:first-child, .v-list-item__icon:first-child {
    margin-right: 5px !important;
  }

  .v-list-item__avatar:first-child {
    margin-right: 12px !important;
  }
  .drawer-list-active{
    color: #fff !important;
    background-color: #1976d2 !important;
    border-color: #1976d2 !important;
  }

  .v-image__image--contain {
    top: 9px;
    height: 60%;
  }
  .instagrab{
    white-space: unset !important;
    height: unset !important;
  }
  .inst a {
    padding: 0 5px !important;
  }

  .allHeight a {
    height: 40px !important;
  }
  .inst a .v-list__item__action {
    height: 40px !important;
  }
  .miniAvatar{
    min-width: 33px !important;
  }
  .miniLogo{
    height: 30px !important;
    width: 30px !important;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-left: 2px;
  }
  .miniLogo .v-image{
    height: unset !important;
  }
  .miniIcon{
    font-size: 24px !important;
  }
  .logoActiv{
    color:#fff !important;
  }
  .logoActiv:before{
    opacity:0 !important;
    border-radius: 4px;
  }

  .v-list-item, .allHeight:before, .inst:before {
    border-radius: 4px;
  }
  .item-p{
    padding: 0 5px !important;
  }
  .theme--dark.v-navigation-drawer {
    background-color: rgb(2,0,36);
  }
  .v-list-item--link:before{
    background-color: unset !important;
  }
  .DrListTitle{
    font-size: 13px !important;
  }
</style>
