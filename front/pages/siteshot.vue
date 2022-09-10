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
              <v-flex xs12>
                <v-card-text>
                  <div class="text-center font-weight-light mb-4 title serif" style="color: #000;">Вставьте ссылку на страницу сайта</div>
                  <div class="linkin">
                  <v-text-field
                  v-model="shotUrl"
                  v-on:keyup.enter="siteshot"
                  label="https://example.com"
                  single-line
                  solo
                  clearable
                  required
                  :rules="[rules.required, rules.regUrl]"
                ></v-text-field>
                <v-btn color="primary" class="SSbtn" @click="siteshot"><v-icon>mdi-download</v-icon></v-btn>
                </div>
                <v-progress-circular
                  v-if="loader"
                  :size="50"
                  color="primary"
                  indeterminate
                  class="SSLoader"
                />

                <v-container v-if="ok" grid-list-md fluid class="SSCont">
                  <div v-if="statError" class="SSInfo">
                    {{ error }}
                  </div>
                  <v-layout v-if="!statError" row wrap align-center justify-center>
                    <v-flex
                      d-flex xs12 sm6 md4 fluid
                      class="mb-30"
                    >
                      <v-card flat tile class="SSPoint">
                        <v-img
                          :src="Url"
                          :lazy-src="`https://picsum.photos/10/6?image=${5 + 10}`"
                          width="100%"
                          class="SSParams SSPoint"
                          @click="originaLink(Url)"
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
                        <v-btn class="SSdwnl"
                        depressed
                        small
                        :href="Url"
                        download
                        color="primary"
                        :loading="loading"
                        :disabled="loading">Скачать</v-btn>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
                <div class="SSback">
                <div class="flex SSflex grid-list-md fluid">
                  <v-flex xs12 sm6 class="SSpb-0">                    
                      <v-select
                        v-model="size"
                        :items="items"
                        label="Снимок"
                        @change="allSize"
                        outline
                        light
                      ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 SSpb-0>                    
                      <v-text-field type="number" v-model="width" :rules="[rules.required, rules.minW]" label="Ширина" />
                  </v-flex>

                  <v-flex v-if="sizeHeight" xs12 sm6 SSpb-0>                    
                      <v-text-field type="number" v-model="height" label="Высота" :rules="[rules.required, rules.minH]" />
                  </v-flex>
                  <v-flex xs12 sm6 SSpb-0>  
                  <p class="SSradioTitle">Формат изображения:</p>
                  <v-radio-group class="SSradioGroup" v-model="fileType" row>
                    <v-radio color="primary" label="jpg" value="jpg"></v-radio>
                    <v-radio color="primary" label="png" value="png"></v-radio>
                  </v-radio-group>
                  </v-flex>
                </div>
                </div>
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
    title: 'Скриншот сайта',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Сервис, позволяющий создать снимок всей страницы сайта с возможностью изменить размер изображения' },
      { hid: 'keywords', name: 'keywords', content: 'Скриншот, сайта, страницы, полностью, всей, целиком, фото, screenshot, siteshot, ' }
    ]
  },
  data () {
    return {
      shotUrl: '',
      loader: false,
      ok: false,
      statError: false,
      error: '',
      loading: false,
      width: 1024,
      height: 720,
      fileTypes: ['jpg', 'png'],
      fileType: 'jpg',
      rules: {
        required: value => !!value || 'Введите URL.',
        regUrl: value => {
        const pattern = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm
        return pattern.test(value) || 'Неверный URL.'
        },
        minW: v => v >= 320 || 'Минимальная ширина 320px',
        minH: v => v >= 220 || 'Минимальная высота 220px',
      },
      items: ['Всей страницы', 'Видимой области'],
      size: 'Всей страницы',
      sizeHeight: false
    }
  },
  methods: {
    ...mapMutations(['SET_TITLE']),
    async siteshot (){
      var url = this.shotUrl
      const pattern = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm
      if(url != ''){
        if(pattern.test(url)){
          this.loader = true
          var data = {
            url: url,
            format: this.fileType,
            width: this.width,
            height: this.height,
            sizeHeight: this.sizeHeight
          }
        }else{
          return
        }
      }else{
        return
      }
     await Service.siteshot(data).then(response => {
      var rd = response.data
      this.loader = false
      this.ok = true
      if(rd.code == '200'){
        this.Url = rd.result
      }else{
        this.statError = true
        if(rd.code == '400'){
          this.error = 'Неверная ссылка'
        }else if(rd.code == '403'){
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
    allSize(){
      if(this.size == 'Видимой области'){
        this.sizeHeight = true
      }else{
        this.sizeHeight = false
      }
    }
  },
  created () {
    this.SET_TITLE('Снимок сайта')
  }
}


</script>

<style>
  .linkin{
    display: flex !important;
    margin: 0 auto !important;
  }
  .SSbtn{
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
  .SSdwnl{
    width: 100% !important;
    margin: 5px  0 0 !important;
  }
  .mb-30{
    margin-bottom: 30px !important;
  }
  .SSParams{
    height: 100%;
    max-height: calc(100% - 10%);
    min-height: 200px;
  }
  .SSPoint{
    cursor: pointer !important;
  }
  .SSLoader{
    display: block;
    margin: 10px auto;
  }
  .SSInfo{
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin: 10px 0;
  }
  .SSCont{
    padding-top: 0 !important;
  }

  @media(max-width: 560px){
    .SSflex{
      display: unset !important;
    }
    .SSradioGroup{
      width: 50%;
      float: right;
      padding: 0;
    }
    .SSradioTitle{
      width: 50%;
      float: left;
    }
  }
  .SSbtn{
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12) !important;
    min-width: 56px !important;
    margin: 1px 4px 0px !important;
    min-height: 48px !important;
  }
  .mb-30{
    margin-bottom: 30px !important;
  }
  .SSflex{
    display: flex;
  }
  .SSradioTitle{
    color: #000;
    font-size: 14px;
    margin-bottom: 0;
  }
  .SSradioGroup{
    margin-top: 0;
  }
  .SSback{
    border-radius: 4px;
    background-color: #f0f0f0;
  }
  .SSpb-0{
    padding-bottom: 0px !important;
  }
</style>