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
            <v-tabs
              light
              slider-color="#999"
              grow
              background-color="primary"
            >
              <v-tab>
                <span class="MINtabText">Css</span>
              </v-tab>
              <v-tab>
                <span class="MINtabText">JavaScript</span>
              </v-tab>
              <v-tab>
                <span class="MINtabText">HTML</span>
              </v-tab>

              <v-tab-item>
                <v-container
                  fluid
                  grid-list-md
                >
                  <v-layout
                    row
                    wrap>
                    <div class="MINw100">
                      <v-card-text>
                        <div class="text-center">
                          <v-textarea
                            class="MINareas"
                            filled
                            label="Вставьте css код"
                            v-model="inputCss"
                            required
                            rows="10"
                            hide-details
                          ></v-textarea>
                        </div>
                      </v-card-text>
                    </div>
                    <div style="width: 100%;">
                    <div class="MINbuttons MINfloat-l mb-2">
                      <v-btn 
                      rounded 
                      color="primary"
                      class="min-button"
                      dark
                      @click="css"
                      :loading="loading"
                      :disabled="loading"
                      >Минифицировать</v-btn>
                    </div>
                    <div class="MINbuttons MINfloat-r">
                      <v-btn 
                      rounded
                      class="min-button"
                      color="primary" 
                      dark
                      v-clipboard:copy="inputCss"
                      v-clipboard:success="copy"
                      >Копировать <v-icon right dark>mdi-content-copy</v-icon></v-btn>
                    </div>
                    </div>
                  </v-layout>
                </v-container>
              </v-tab-item>

              <v-tab-item>
                <v-container
                  fluid
                  grid-list-md
                >
                  <v-layout
                    row
                    wrap>
                    <div class="MINw100">
                      <v-card-text>
                        <div class="text-center">
                          <v-textarea
                            class="MINareas"
                            filled
                            label="Вставьте JavaScript код"
                            v-model="inputJs"
                            required
                            rows="10"
                            hide-details
                          ></v-textarea>
                        </div>
                      </v-card-text>
                    </div>
                    <div style="width: 100%;">
                    <div class="MINbuttons MINfloat-l mb-2">
                      <v-btn 
                      rounded 
                      color="primary"
                      class="min-button"
                      dark
                      @click="js"
                      :loading="loading"
                      :disabled="loading"
                      >Минифицировать</v-btn>
                    </div>
                    <div class="MINbuttons MINfloat-r">
                      <v-btn
                      class="min-button"
                      rounded 
                      color="primary" 
                      dark
                      v-clipboard:copy="inputJs"
                      v-clipboard:success="copy"
                      >Копировать <v-icon right dark>mdi-content-copy</v-icon></v-btn>
                    </div>
                    </div>
                  </v-layout>
                </v-container>
              </v-tab-item>

              <v-tab-item>
                <v-container
                  fluid
                  grid-list-md
                >
                  <v-layout
                    row
                    wrap>
                    <div class="MINw100">
                      <v-card-text>
                        <div class="text-center">
                          <v-textarea
                            class="MINareas"
                            filled
                            label="Вставьте HTML код"
                            v-model="inputHtml"
                            required
                            rows="10"
                            hide-details
                          ></v-textarea>
                        </div>
                      </v-card-text>
                    </div>
                    <div style="width: 100%;">
                    <div class="MINbuttons MINfloat-l mb-2">
                      <v-btn 
                      rounded 
                      color="primary"
                      class="min-button"
                      dark
                      @click="html"
                      :loading="loading"
                      :disabled="loading"
                      >Минифицировать</v-btn>
                    </div>
                    <div class="MINbuttons MINfloat-r">
                      <v-btn
                      class="min-button"
                      rounded 
                      color="primary" 
                      dark
                      v-clipboard:copy="inputHtml"
                      v-clipboard:success="copy"
                      >Копировать <v-icon right dark>mdi-content-copy</v-icon></v-btn>
                    </div>
                    </div>
                  </v-layout>
                </v-container>
              </v-tab-item>

            </v-tabs>
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
    title: 'Минификатор кода',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Минификатор кода позволяет минифицировать css, JavaScript и HTML код онлайн, т.е уменьшить его размер и ускорить загрузку сайта' },
      { hid: 'keywords', name: 'keywords', content: 'минификатор, css, javascript, js, html, код, уменьшить, размер, файла, ускорить, загрузку, minify, удалить комментарии из кода, оптимизатор, бесплатно' }
    ]
  },
  data () {
    return {
        inputCss: '',
        loading: false,
        snackbar: false,
        color: 'cyan darken-2',
        timeout: 2000,
        text: 'Скопировано',
        inputJs: '',
        inputHtml: '',
      }
  },
  methods: {
    ...mapMutations(['SET_TITLE']),
    async css(){
      var css = this.inputCss
      if(css != ''){
        this.loading = true
        var data = {
            css: css
          }
       await Service.cssMin(data).then(response => {
        this.loading = false
          if(response.data == "" || response.data == " "){
            this.inputCss = "Ошибка"
            return
          }
          if(response.data.result == ''){
            this.inputCss = 'Введите css код'
            return
          }
          this.inputCss = response.data.result
        })
        .catch(error => {
            this.loading = false
            if(error == 'Error: Request failed with status code 413'){
              this.inputCss = 'Слишком большой объем, попробуйте минифицировать код частями'
            }else{
              this.inputCss = error
            }
        })
      }else{
        this.loading = false
      }
    },
    async js(){
      var js = this.inputJs
      if(js != ''){
        this.loading = true
        var data = {
            js: js
          }
       await Service.jsMin(data).then(response => {
        this.loading = false
          if(response.data == "" || response.data == " "){
            this.inputJs = "Ошибка"
            return
          }
          if(response.data.result == ''){
            this.inputJs = 'Введите js'
            return
          }
          if(!response.data.result.error){
          	this.inputJs = response.data.result.code
      	  }else{
      	  	this.inputJs = response.data.result.error.message
      	  }
        })
        .catch(error => {
            this.loading = false
            if(error == 'Error: Request failed with status code 413'){
              this.inputJs = 'Слишком большой объем, попробуйте минифицировать код частями'
            }else{
              this.inputJs = error
            }
        })
      }else{
        this.loading = false
      }
    },
    async html(){
      var html = this.inputHtml
      if(html != ''){
        this.loading = true
        var data = {
            html: html
          }
       await Service.HtmlMin(data).then(response => {
        this.loading = false
          if(response.data == "" || response.data == " "){
            this.inputHtml = "Ошибка"
            return
          }
          if(response.data.result == ''){
            this.inputHtml = 'Введите js'
            return
          }

          this.inputHtml = response.data.result
        })
        .catch(error => {
            this.loading = false
            if(error == 'Error: Request failed with status code 413'){
              this.inputHtml = 'Слишком большой объем, попробуйте минифицировать код частями'
            }else{
              this.inputHtml = error
            }
        })
      }else{
        this.loading = false
      }
    },
    copy(){
      this.snackbar = true 
    }
  },
  created () {
    this.SET_TITLE('Минификатор кода')
  }
}
</script>
<style>
  .MINarea .v-input__slot {
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
  }
  .MINresult{
    background: #f0f0f0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .MINicon{
    margin-top: 12px;
    padding-right: 2px;
    cursor: pointer;
  }
  .MINres{
    display: flex;
  }
  .MINw100{
  	width: 100%;
  }
  .MINbuttons{
  	width: unset;
  }
  .MINfloat-r{
  	float: right;
  }
  .MINfloat-l{
  	float: left;
  }
  .min-button{
  	width: unset;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0;
  }
  @media (max-width: 450px){
  	.MINbuttons{
  		width: 100% !important;
  		float: unset !important;
  		text-align: center !important;
  	}
  	.min-button{
  		width: 100% !important;
  	}
  }
  .MINtabText{
    font-size: 14px;
    text-transform: none;
  }
  .MINareas{
    font-size: 14px;
  }
  .theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    background-color: #1976d2 !important;
  }
</style>