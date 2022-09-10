import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '@mdi/font/css/materialdesignicons.min.css'

Vue.use(Vuetify, {
  iconfont: 'mdi',
  icons: {
    checkboxOff: 'mdi-checkbox-blank-outline',
    checkboxOn: 'mdi-checkbox-marked'
  }
})