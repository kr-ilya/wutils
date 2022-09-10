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
                <v-card-text>
                  <div class="text-center">
                    <v-text-field
                      filled
                      label="Введите IP-адрес или домен"
                      height="129"
                      v-model="scan"
                      required
                      v-on:keyup.enter="scanPorts(scan)"
                    ></v-text-field>
                  </div>
                </v-card-text>
              </v-flex>
              <v-flex xs12 sm6>
                <v-card-text>
                  <div class="text-center">
                    <v-textarea
                      filled
                      label="Результат:"
                      :value="resultScan"
                    ></v-textarea>
                    <div class="text-center">
                    </div>
                  </div>
                </v-card-text>
              </v-flex>
              <div style="width: 100%;">
              <div class="text-center">
                <v-btn 
                roundeded 
                color="primary" 
                light
                @click="scanPorts(scan)"
                :loading="loading"
                :disabled="loading"
                >Сканировать</v-btn>
              </div>
              </div>
              <div class="text-left font-weight-light caption serif" style="margin-top: 20px;">* Среднее время сканирования 2 минуты</div>
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
    title: 'Сканер портов',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Сервис для поиска открытых портов сайта по домену или ip адресу' },
      { hid: 'keywords', name: 'keywords', content: 'сканирование, открытых, портов, поиск портов, ports, open, scan, уязвимостей, поиск.' }
    ]
  },
  data () {
    return {
        scan: '',
        resultScan: '',
        loading: false
    }
  },
  methods: {
    ...mapMutations(['SET_TITLE']),
  async scanPorts (scan){
      if(scan != ''){
      this.loading = true
      var scan = scan.replace(/^https?\:\/\//i, "");
     await Service.scanPorts(scan).then(response => {
        if(response.data.length === 0){
          this.loading = false
          this.resultScan = "Не найдено открытых портов"
          return
        }
        if(response.data.type !== undefined){
          this.loading = false
          this.resultScan = response.data.type + ": " + response.data.text
          return
        }
        if(response.data.constructor !== Array){
          this.loading = false
          this.resultScan = response.data
          return
        }
        if(response.data == "" || response.data == " "){
          this.loading = false
          this.resultScan = "Ошибка"
          return
        }
          var d = response.data[0];
          var res = 'ip ' + d.ip //ip
          d.openPorts.forEach(function(item, i) {
            res = res + "\n" + "open " + item.port + ' ' + item.service
          });
          this.loading = false
          this.resultScan = res
      })
      .catch(error => {
          this.loading = false
          this.resultScan = error
      })
    }else{
      this.loading = false
      this.resultScan = 'Неверный адрес'
    }
  }
  },
  created () {
    this.SET_TITLE('Сканер портов')
  }
}
</script>
