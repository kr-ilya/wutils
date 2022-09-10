<template>
  <v-app-bar
    id="core-toolbar"
    color="#eee"
    dark
    height='60'
    style="flex: unset;"
    :class="mini ? 'mini' : ''"
  >
    <v-app-bar-nav-icon @click.stop="onClickBtn" light></v-app-bar-nav-icon>

    <v-toolbar-title>{{ title }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <nuxt-link
      v-ripple
      exact
      to="/"
      nuxt
      router
      no-prefetch
    >
      <v-icon color="tertiary" size="20">mdi-view-dashboard</v-icon>
    </nuxt-link>
  </v-app-bar>

</template>

<script>

import {
  mapMutations
} from 'vuex'

export default {
  data: () => ({
    title: null,
    mini: false,
    clickMini: false
  }),
  computed: {
    titlee () {
      return this.$store.state.title
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
    this.title = this.$store.state.title
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    ...mapMutations(['SET_DRAWER', 'TOGGLE_DRAWER', 'SET_MINI']),
    onClickBtn () {
      if(window.innerWidth < 600){
        if(this.$store.state.mini !== true){
          this.SET_DRAWER(!this.$store.state.drawer)
        }else{
          this.SET_MINI(false)
          this.SET_DRAWER(!this.$store.state.drawer)
        }
      }else{
        this.SET_MINI(!this.$store.state.mini)
        this.mini = this.$store.state.mini
        this.clickMini = true
      }
    },
    onResponsiveInverted () {
      if(!this.clickMini){
        if (window.innerWidth < 820) {
          this.SET_MINI(true)
          this.mini = true
        } else {
          this.SET_MINI(false)
          this.mini = false
        }
      }
    }
  }
}
</script>

<style>
  #core-toolbar a {
    text-decoration: none;
  }

  .v-toolbar .v-btn .v-icon {
    font-size: 20px !important;
  }
  .toolbar-items .v-icon{
    font-size: 20px !important;
  }
  .title_text{
    font-size: 18px !important;
    font-weight: 300;
  }
  @media(max-width: 425px){
    .title_text{
      font-size: 16px !important;
    }
  }
  @media(max-width: 375px){
    .title_text{
      font-size: 15px !important;
    }
  }
  @media(max-width: 345px){
    .title_text{
      font-size: 15px !important;
    }
  }
  @media(max-width: 320px){
    .title_text{
      font-size: 13px !important;
    }
  }
  @media(max-width: 300px){
    .title_text{
      font-size: 11px !important;
    }
  }
  .mini .v-toolbar__content {
    margin-left: 55px !important;
  }

  .v-toolbar__content > .v-btn.v-btn--icon:first-child, .v-toolbar__extension > .v-btn.v-btn--icon:first-child {
    margin-left: 0px !important; 
  }
  .v-toolbar__content > .v-btn.v-btn--icon:first-child + .v-toolbar__title, .v-toolbar__extension > .v-btn.v-btn--icon:first-child + .v-toolbar__title {
    padding-left: 0px;
}
</style>
