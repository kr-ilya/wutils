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
              <v-flex xs12 sm6>

                  <div class="text-center">
                    <v-textarea
                      filled
                      maxlength="100"
                      label="Введите текст"
                      :value="text"
                      @change="changetext"
                    ></v-textarea>
                    <div class="text-center">
                      <v-btn 
                      roundeded 
                      color="primary" 
                      light
                      @click="Punycoder('text')"
                      :loading="loading"
                      :disabled="loading"
                      >Текст в Punycode</v-btn>
                    </div>
                  </div>
              </v-flex>
              <v-flex xs12 sm6>
                  <div class="text-center">
                    <v-textarea
                      filled
                      maxlength="100"
                      label="Введите Punycode"
                      :value="Punycode"
                      @change="changecode"
                    ></v-textarea>
                    <div class="text-center">
                      <v-btn 
                      roundeded 
                      color="primary" 
                      light
                      @click="Punycoder('code')"
                      :loading="loading2"
                      :disabled="loading2"
                      >Punycode в текст</v-btn>
                    </div>
                  </div>
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
  mapMutations,
} from 'vuex'
export default {
  head: {
    title: 'Punycode конвертер',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Конвертер punycode для русских (IDN) доменов онлайн бесплатно' },
      { hid: 'keywords', name: 'keywords', content: 'punycode, конвертер, IDN, converter, конвертировать русский домен, русский, домен, изменить' }
    ]
  },
  data () {
    return {
        Punycode: '',
        text: '',
        loading: false,
        loading2: false
    }
  },
  methods: {
     ...mapMutations(['SET_TITLE']),
   async Punycoder (type) {
      if(type == 'text'){
      this.loading = true
      setTimeout(() => (this.loading = false), 10000000)
        var postData = {
          type: 'text',
          pdata: this.text
        }
      }else{
      this.loading2 = true
      setTimeout(() => (this.loading2 = false), 10000000)
        var postData = {
          type: 'code',
          pdata: this.Punycode
        }
      }
     await Service.Punycoder(postData).then(response => {
        if(type == 'text'){
          this.loading = false
          this.Punycode = response.data
        }else{
          this.loading2 = false
          this.text = response.data
        }
      })
      .catch(error => {
        this.loading = false
        this.loading2 = false
        if(error == 'Too many requests, please try again later.'){
          var err = 'Слишком много запросов, попробуйте позже.'
        }else{
          var err = 'Ошибка, попробуйте позже'
        }
        if(type == 'text'){
          this.Punycode = err
        }else{
          this.text = err
        }
      })
    },
    changecode(e){
      this.Punycode = e
    },
    changetext(e){
      this.text = e
    }
  },
  created () {
    this.SET_TITLE('Punycode конвертер')
  }
}
</script>
