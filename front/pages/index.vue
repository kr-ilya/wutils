<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout wrap>
      <v-flex xs12>
        <v-card light>
          <v-card-text>
          <v-container
            fluid
            grid-list-md
          >
            <v-layout
              row
              wrap>
              <v-flex
                xs12
                sm6>
                <v-card-text style="color: rgba(0,0,0,.87);">
                  <div class="text-center  mb-4 display-2 center serif">Ваш IP:</div>
                  <div class="d-contents size-calc text-center mb-4 display-1 center serif">
                    <v-progress-circular
                      v-if="loader"
                      :size="50"
                      color="primary"
                      indeterminate
                    />
                    <v-snackbar
                        v-model="snackbar"
                        :color="color"
                        :timeout="timeout"
                      >
                        {{ text }}
                        <v-icon
                        size="16"
                        dark
                        @click="snackbar = false"
                      >
                        mdi-close-circle
                      </v-icon>
                      </v-snackbar>
                    <v-tooltip bottom color='#033'>
                      <template v-slot:activator="{ on }">
                        <div class="ip" v-if="!loader" v-on="on"
                        v-clipboard:copy="ip"
                        v-clipboard:success="copy">{{ ip }}</div>
                      </template>
                      <span>{{ copy_text }}</span>
                    </v-tooltip>
                  </div>
                  <div class="text-center">
                    <v-btn
                      roundeded
                      color="primary"
                      dark
                      @click="vpn()">VPN</v-btn>
                  </div>
                </v-card-text>
              </v-flex>
              <v-flex
                xs12
                sm6>
                <v-card-text>
                  <v-layout
                    align-start
                    justify-center
                    column
                    fill-height>
                    <span class="m10">Местоположение:  <b>{{ country }} {{ city }} </b></span>
                    <span class="m10">Провайдер: <b>{{ provaider }}</b></span>
                    <span class="m10">Хост: <b>{{ host }}</b></span>
                    <span class="m10">Прокси: <b>{{ proxy }}</b></span>
                  </v-layout>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
     </v-container>
</template>
<script>
import Service from '@/services/Service.js'
// import detect from 'detect.js'
import {
  mapMutations,
} from 'vuex'
export default {
  head: {
    title: 'Узнать IP-адрес',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Сервис онлайн инструментов и утилит, с помощью которого вы можете узнать ip адрес, скачать фото и видео с инстраграм, сканировать порты, punycode конвертер, узнать цвет пикселя на фото и др.' },
      { hid: 'keywords', name: 'keywords', content: 'ip, ip-адрес, местоположение, порт, сканер, punycode, цвет пикселя по фото, скачать фото и видео с инстраграма, инстаграм, скачать, инструменты, онлайн, бесплатно, веб, web, утилиты, все инструменты' }
    ]
  },
  data () {
    return {
      copy_text: 'Скопировать',
      snackbar: false,
      color: 'cyan darken-2',
      timeout: 2000,
      text: 'IP скопирован',
      open: false
    }
  },
  computed: {
    ip () {
      return this.$store.state.ip
    },
    country () {
      return this.$store.state.country
    },
    city () {
      return this.$store.state.city
    },
    provaider () {
      return this.$store.state.provaider
    },
    host () {
      return this.$store.state.host
    },
    proxy () {
      return this.$store.state.proxy
    },
    loader () {
      return this.$store.state.loader
    }
  },
  methods: {
    ...mapMutations(['SET_IP', 'SET_COUNTRY', 'SET_CITY', 'SET_PROVAIDER', 'SET_PROXY', 'SET_HOST', 'SET_COMPLETE', 'SET_LOADER', 'SET_TITLE']),
    vpn () {
      window.open('https://hidemyna.me/vpn/#5cc54a78ed146', '_blank')
    },
    copy () {
      this.copy_text = 'Скопировано',
      this.snackbar = true
    }

  },
  created () {
    this.SET_TITLE('Узнать IP-адрес')
   // при создании
    if (!this.$store.state.complete) {
      Service.getIP().then(response => {
        this.SET_IP(response.data.query)
        this.SET_COUNTRY(response.data.country + ',')
        this.SET_CITY(response.data.city)
        this.SET_PROVAIDER(response.data.isp)
        this.SET_PROXY(response.data.proxy ? 'Используется' : 'Не используется')
        this.SET_HOST(response.data.reverse)
        this.SET_LOADER(false)
        this.SET_COMPLETE(true)
      })
      .catch(error => {
        this.SET_LOADER(false)
        this.SET_COMPLETE(true)
        this.SET_IP('Ошибка,\nпопробуйте позже')
      })
    }
  }
}
</script>
<style type="text/css">
  b{
    font-size: inherit !important;
  }
  @media (max-width: 465px){
    .size-calc{
      font-size: calc( (100vw - 320px)/(465 - 320) * (45 - 27) + 27px) !important;
    }
  }
  @media (min-width: 600px){
  .size-calc {
    font-size: calc( (100vw - 550px)/(1240 - 320) * (45 - 27) + 32px) !important;
  }
}
  
  .v-toolbar .v-toolbar__content .v-toolbar__items .toolbar-items .v-icon {
    font-size: 20px;
  }

  .m10{
    margin: 5px;
    background-color: #ffd11b;
    padding: 5px;
    width: 100%;
    font-size: 16px;
    color: #000;
  }
  .contents{
    display: contents;
  }
  .ip{
    cursor: pointer;
  }
</style>
