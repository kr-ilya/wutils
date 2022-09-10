<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout wrap>
      <v-flex xs12>
        <v-card>
          <v-card-text>
          <v-container
            fluid
            grid-list-md
          >
            <v-layout
              row
              wrap>
              <v-flex xs12>
                <v-card-text>
                  <div class="text-center mb-4 title serif instURL">Вставьте ссылку на Фото/Видео/IGTV
 или профиль Инстаграм</div>
                  <div class="linkin">
                  <v-text-field
                  v-model="instUrl"
                  label="https://www.instagram.com/p/ByBHplwjMDR/"
                  single-line
                  solo
                  clearable
                  required
                  v-on:keyup.enter="inst"
                  :rules="[rules.required, rules.regUrl]"
                ></v-text-field>
                <v-btn color="primary" class="instbtn" @click="inst"><v-icon>mdi-download</v-icon></v-btn>
                </div>
                <v-progress-circular
                      v-if="loader"
                      :size="50"
                      color="primary"
                      indeterminate
                      class="instLoader"
                    />
                <v-container v-if="ok" grid-list-md fluid class="instCont">
                  <div v-if="statError" class="instInfo">
                    {{ error }}
                  </div>
                  <div v-if="info" class="instInfo">
                    {{ infoText }}
                  </div>
                  <v-layout v-if="!statError" row wrap align-center justify-center>
                    <v-flex
                      v-for="n in links.length"
                      :key="n"
                      d-flex xs12 sm6 md4 fluid
                      class="mb-30"
                    >
                      <v-card flat tile class="instPoint">
                        <v-img
                          v-if="links[n-1].toString().indexOf('.mp4') === -1"
                          :src="links[n-1]"
                          :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
                          width="100%"
                          class="instParams instPoint"
                          @click="originaLink(links[n-1])"
                        >
                          <template v-slot:placeholder>
                            <v-layout
                              fill-height
                              align-center
                              justify-center
                              ma-0
                            >
                              <v-progress-circular indeterminate color="grey lighten-5 instLoa"></v-progress-circular>
                            </v-layout>
                          </template>
                        </v-img>
                        <video v-if="links[n-1].toString().indexOf('.mp4') !== -1" controls name="media" width="100%" class="instParams isntVideo" :src="links[n-1]"></video>
                        <v-btn
                        class="instdwnl"
                        @click="download(links[n-1])"
                        depressed
                        small
                        color="primary"
                        :loading="loading"
                        :disabled="loading">Скачать</v-btn>
                      </v-card>
                    </v-flex>
                  </v-layout>

                  <v-expansion-panels v-if='okInfo'>
                      <v-expansion-panel>
                        <v-expansion-panel-header style="background-color: #eee">Файл не скачивается?</v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <b>Фото:</b> нажмите на изображение (откроется в новой вкладке), в открывшемся окне щелкните правой кнопкой мыши (долгий тач на телефоне) и сохраните картинку. <br/><b>Видео:</b> нажмите на 3 точки в правом нижнем углу видео (рядом с кнопкой полноэкранного режима) и выберите "Cкачать"
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                </v-container>
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
import {
  mapMutations
} from 'vuex'
export default {
  head: {
    title: 'Скачать фото и видео с Instagram',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Сервис для скачивания фото/видео/IGTV или аватара профиля с Instagram бесплатно в исходном качестве' },
      { hid: 'keywords', name: 'keywords', content: 'Инстаграм, скачать, фото, видео, IGTV, Instagram, загрузить, картинка, ролик, оригинал, качество, исходное, аватар, профиля, аккаунт, лого' }
    ]
  },
  data () {
    return {
      instUrl: '',
      loader: false,
      ok: false,
      okInfo: false,
      links: {},
      statError: false,
      error: '',
      loading: false,
      info: false,
      infoText: '',
      snackbar: false,
      color: 'cyan darken-2',
      timeout: 20000,
      text: '',
      rules: {
        required: value => !!value || 'Введите URL.',
        regUrl: value => {
        const pattern = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm
        return pattern.test(value) || 'Неверный URL.'
        }
      }
    }
  },
  methods: {
    ...mapMutations(['SET_TITLE']),
    async inst (){
      var url = this.instUrl
      if(url != ''){
        if(url.indexOf('instagram.com/') != -1){
          this.loader = true
          this.statError = false
          var data = {
            url: url
          }
        }else{
          return
        }
      }else{
        return
      }
     await Service.instagrab(data).then(response => {
      var rd = response.data
      this.loader = false
      this.ok = true
      this.okInfo = true
      if(rd.code == '2000'){
        this.info = false
        this.links = rd.result
      }else if(rd.code == '200'){
        this.loader = false
        this.ok = true
        this.info = true
        this.infoText = 'Аватар:'
        this.links = rd.result
      }else if(rd.code == '20'){
        this.loader = false
        this.ok = true
        this.info = true
        this.links = rd.result
        this.infoText = 'IGTV'
      }else{
        this.statError = true
        if(rd.code == '4000'){
          this.error = 'Неверная ссылка'
        }else if(rd.code == '4004'){
          this.error = 'Профиль закрыт или материалы не найдены'
        }else if(rd.code == '404'){
          this.error = 'Профиль не найден'
        }else if(rd.code == '0'){
          this.error = rd.result
        }else{
          this.error = 'Ошибка'
        }
      }
      })
      .catch(error => {
        this.loader = false
        this.statError = true
        this.error = 'Ошибка'
        this.ok = true
      })
    },
    originaLink(link){
      window.open(link, '_blank')
    },
    download(url, filename){
      this.loading = true
      if (!filename) filename = url.split('\\').pop().split('/').pop().split('?')[0];
        fetch(url, {
          headers: new Headers({
            'Origin': location.origin
          }),
          mode: 'cors'
        })
        .then(response => response.blob())
        .then(blob => {
          let blobUrl = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.download = filename;
          a.href = blobUrl;
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.loading = false
        })
        .catch(e => {
          this.snackbar = true
          this.text = 'Ошибка скачивания'
          this.loading = false
        });
        }
  },
  created () {
    this.SET_TITLE('Скачать фото и видео с Instagram')
  }
}


</script>

<style>
  .linkin{
    display: flex !important;
    width: 100%;
    margin: 0 auto !important;
  }
  .instbtn{
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12) !important;
    min-width: 56px !important;
    margin: 1px 4px 0px !important;
    min-height: 48px !important;
  }
  video:active, video:focus {
  outline: none !important;
  }
  video::-moz-focus-inner {
    border: 0 !important;
  }
  .instdwnl{
    width: 100% !important;
    margin: 5px  0 0 !important;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0;
  }
  .mb-30{
    margin-bottom: 30px !important;
  }
  .instParams{
    height: 100%;
    max-height: calc(100% - 10%);
  }
  .instPoint{
    cursor: pointer !important;
  }
  .instLoader{
    display: block;
    margin: 10px auto;
  }
  .isntVideo{
    margin-bottom: -5px !important;
  }
  .instInfo{
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin: 10px 0;
  }
  .instCont{
    padding-top: 0 !important;
  }
  .instCont .v-expansion-panel__header{
    background-color: #eee;
  }
  .instURL{
    color: #000;
    font-weight: 400 !important;
  }
</style>