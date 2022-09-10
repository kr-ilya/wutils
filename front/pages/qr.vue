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
              <v-flex xs12 sm6>
                <v-card-text>
                  <div class="text-center">
                    <v-textarea
                      filled
                      maxlength="1000"
                      hide-details
                      label="Введите текст"
                      :value="text"
                      @change="changetext"
                      rows="8"
                      class="QRareas"
                    ></v-textarea>
                    <div class="text-center">
                      <v-btn 
                      rounded 
                      color="primary" 
                      dark
                      @click="qrCode"
                      :loading="loading"
                      :disabled="loading"
                      class="QRdwnl mt-2"
                      >Создать</v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-flex>
              <v-flex xs12 sm6 class="QRresultBlock">
                <v-card-text>
                  <v-tabs
                    light
                    slider-color="#999"
                    v-model="active"
                    background-color="primary"
                  >
                    <v-tab>
                      <span class="QRtabText">Пример QR кода</span>
                    </v-tab>
                    <v-tab >
                      <span class="QRtabText">Ваш QR код</span>
                    </v-tab>

                    <v-tab-item>
                      <div class="text-center">
                        <v-card color="grey darken-2" class="white--text" min-height='200' max-height="230">
                          <v-card-title primary-title>
                            <div class='qrResult'>                            
                              <img
                              id='qr'
                              :src="example"
                              width="100%"
                              class="QRParams QRPoint"
                              @click="originaLink(qr)"
                              ref="qrExample"
                              alt="Пример QR кода"
                              :style="{ border: `${marginQR}px solid white` }"
                            />

                            <div class="QRwidth-1">
                              <span class="QRspanWidth">{{ width }}px</span>
                            </div>

                            <div class="QRwidth-2">
                              <span class="QRspanWidth">{{ width }}px</span>
                            </div>

                            </div>
                          </v-card-title>
                        </v-card>
                      </div>
                    </v-tab-item>

                    <v-tab-item>
                      <div class="text-center">
                        <v-card color="grey darken-2" class="white--text" min-height='200'>
                          <v-card-title primary-title style="padding: 10px;">
                            <div class='qrResult'>
                              <div class="headline qrHeadRes" v-show="res">{{result}}</div>
                              
                              <img
                              v-show="resultDone"
                              :src="qr"
                              width="100%"
                              class="QRParams QRPoint"
                              @click="originaLink(qr)"
                              alt="Ваш QR код"
                            />


                            </div>
                          </v-card-title>

                          <v-card-actions v-show="!res" class="QRbtnDownl">
                            <v-btn class="QRdwnl"
                              download
                              :href="qr"
                              download
                              depressed
                              small
                              color="primary">
                              Скачать
                            </v-btn>
                          </v-card-actions>

                        </v-card>
                      </div>
                    </v-tab-item>

                  </v-tabs>
                </v-card-text>
              </v-flex>

              <v-flex xs12 sm6 v-if="resultDone" style="padding: 12px 12px 12px 0;">
              <v-textarea
                filled
                label="Прямая ссылка на изображение"
                :value="qr"
                rows="4"
                hide-details
                class="QRareas"
              ></v-textarea>

              <v-btn class="QRdwnl"
                v-clipboard:copy="qr"
                v-clipboard:success="copy"
                depressed
                small
                color="primary">
                Скопировать
              </v-btn>

              </v-flex>
              <v-flex xs12 sm6 v-if="resultDone" style="padding: 12px 0 12px 12px;">
                <v-textarea
                filled
                label="Код для вставки на сайт"
                :value="code"
                rows="4"
                hide-details
                class="QRareas"
              ></v-textarea>

              <v-btn class="QRdwnl"
                v-clipboard:copy="code"
                v-clipboard:success="copy"
                depressed
                small
                color="primary">
                Скопировать
              </v-btn>

              </v-flex>

              <v-flex xs12 sm6 class="QRflex QRotstLeft">
                <v-slider
                  hide-details
                  v-model="margin"
                  label="Отступы"
                  :max="4"
                  :min="0"
                  :step="1"
                  thumb-label="always"
                  @input="marginChange"
                  @change="marginChange"
                  style="margin-top: 5%;"
                ></v-slider>
              </v-flex>
              <v-flex xs12 sm6 class='QRflex QRotstRight'>
                <v-text-field
                  v-model="width"
                  label="Размеры"
                  type="number"
                  suffix="px"
                  min="50"
                  class="QRareas"
                  max='1000'
                  :rules="[rules.required, rules.min, rules.max]"
                ></v-text-field>
              </v-flex>

              <v-snackbar
                v-model="snackbar"
                :color="color"
                :timeout="timeout"
              >
                {{ textSnack }}
                <v-icon
                size="16"
                dark
                @click="snackbar = false"
              >
                mdi-close-circle
              </v-icon>
              </v-snackbar>

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
  mapMutations,
} from 'vuex'
export default {
  head: {
    title: 'Генератор QR кодов',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Быстрый и бесплатный генератор QR кода онлайн создаст Quick Response код в виде изображения с прямой ссылкой и возможностью вставки на сайт.' },
      { hid: 'keywords', name: 'keywords', content: 'qr код, qr, создать, генератор, быстрое создание qr кода, Quick Response, онлайн, бесплатно, йк' }
    ]
  },
  data () {
    return {
        result: 'Здесь будет Ваш QR код',
        text: '',
        loading: false,
        resultDone: false,
        example: 'https://wutils.ru/qrcodes/example.png',
        qr: '',
        res: true,
        margin: 1,
        marginQR: 4,
        width: 150,
        active: null,
        code: '',
        rules: {
          required: value => !!value || 'Это обязательное числовое поле.',
          min: v => v >= 50 || 'Минимальный размер 50px',
          max: v => v <= 1000 || 'Максимальный размер 1000px'
        },
        snackbar: false,
        color: 'cyan darken-2',
        timeout: 2000,
        textSnack: 'Данные скопированы'
    }
  },
  methods: {
     ...mapMutations(['SET_TITLE']),
   async qrCode () {
      this.active = 1
      this.loading = true
      this.resultDone = false
      setTimeout(() => (this.loading = false), 10000000)
        var postData = {
          text: this.text,
          margin: this.margin,
          width: this.width
        }     
     await Service.qrCode(postData).then(response => {
          this.loading = false
          this.res = true
          if (response.data.code == '200'){
            this.res = false
            this.result = ''
            this.resultDone = true
            this.qr = response.data.result
            this.code = '<a href="http://wutils.ru/qr" target="_blank"><img src="' + response.data.result + '" width="170" height="170" border="0" title="QR код"></a>'
          }else{
            this.result = response.data.result
          }
      })
      .catch(error => {
        this.res = true
        this.loading = false
        if(error == 'Too many requests, please try again later.'){
          var err = 'Слишком много запросов, попробуйте позже.'
        }else{
          var err = 'Ошибка, попробуйте позже'
        }
        this.result = err
      })
    },
    changetext(e){
      this.text = e
    },
    originaLink(link){
      window.open(link, '_blank')
    },
    marginChange(){
        this.marginQR = this.margin * 4
        this.active = 0
    },
    copy () {
      this.snackbar = true
    }
  },
  created () {
    this.SET_TITLE('Генератор QR кодов')
  }
}
</script>
<style type="text/css">
  .QRPoint{
    cursor: pointer !important;
  }
  .QRParams{
    height: 100%;
    max-height: calc(100% - 10%);
    max-width: 120px;
  }
  .qrResult{
    margin: 0 auto;
  }
  .qrHeadRes{
    margin-top: 10%;
  }
  .QRresultBlock{
    padding-top: 28px;
  }
  .QRdwnl{
    width: 100% !important;
    margin: 5px  0 0 !important;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0;
  }
  .QRbtnDownl{
    padding: 0px !important;
    position: absolute;
    bottom: 0;
    width: 100%
  }
  .QRwidth-1 {
    position: relative;
    font-size: medium;
    line-height: 1;
  }
  .QRwidth-2 {
    position: relative;
    transform: rotate(-90deg);
    left: -75px;
    top: -91px;
    line-height: 1;
    font-size: medium;
  }
  .QRspanWidth{
    position: relative;
  }
  .QRflex{
    background-color: #f0f0f0;
  }
  .QRotstLeft{
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
  }
  .QRotstRight{
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .QRtabText{
    font-size: 14px;
    text-transform: none;
  }

  .QRareas{
    font-size: 14px;
  }
</style>