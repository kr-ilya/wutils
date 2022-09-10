<template>
  <v-footer
    height="54"
    absolute
    >
    <span
      style="vertical-align: sub;"
      >
      <nuxt-link
      class="tertiary--text footer-links"
      exact
      no-prefetch
      to="/"
      >
      Главная
      </nuxt-link>
    </span>

    <v-spacer v-if="!miniVariant"></v-spacer>
    <span class="mail tertiary--text" style="font-size: 16px;">
        <v-tooltip top color='#033'>
          <template v-slot:activator="{ on }">
            <v-icon light size="20" class="pointer"  v-on="on"
            v-clipboard:copy="mail"
            v-clipboard:success="copy">mdi-email-outline</v-icon>
          </template>
          <span>{{ copy_text }}</span>
        </v-tooltip>
      <a class="linkcolor" href="mailto:help@wutils.ru" target="_blank" >{{ mail }}</a>
    </span>
    <div class='font-weight-light tertiary--text'>&copy; {{ new Date().getFullYear() }}</div>
    <v-snackbar
    v-model="snackbar"
    :color="color"
    :timeout="timeout"
  >
    {{ copy_success }}
    <v-icon
    size="16"
    dark
    @click="snackbar = false"
  >
    mdi-close-circle
  </v-icon>
  </v-snackbar>
  </v-footer>
</template>

<script>
export default {
  data () {
    return {
      mail: 'help@wutils.ru',
      copy_text: 'Скопировать',
      copy_success: 'E-Mail скопирован',
      snackbar: false,
      color: 'cyan darken-2',
      timeout: 2000,
      miniVariant: false
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
    copy () {
      this.copy_text = 'Скопировано',
      this.snackbar = true
    },
    onResponsiveInverted () {
      if (window.innerWidth < 350) {
        this.miniVariant = true
      } else {
        this.miniVariant = false
      }
    }
  },
}
</script>

<style>
#core-footer {
  z-index: 0;
}
.w-100{
  width: 100%;
}
.v-footer {
  height: 54px !important;
  background: #eee !important;
  padding: 15px 24px !important;
}
.mail{
  font-weight: 400;
  padding-right: 10px;
}
.pointer{
  cursor: pointer;
}
.inline{
  display: inline-block;
}
.linkcolor{
  color: rgba(0,0,0,0.87) !important;
}
.w-25{
  width: 25%;
}
@media(max-width: 350px){
  .v-footer{
    padding: 15px 0!important;
  }
}
</style>
