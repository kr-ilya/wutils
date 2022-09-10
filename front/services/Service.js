import Api from '@/services/Api'

export default {
  getIP () {
    return Api().get('/')
  },

  Punycoder (params) {
    return Api().post('punycode', params)
  },

  scanPorts (params) {
    return Api().get('ports/' + params)
  },

  instagrab (params) {
    return Api().post('instagrab', params)
  },

  siteshot (params) {
    return Api().post('siteshot', params)
  },

  cssMin (params) {
    return Api().post('css_mini', params)
  },
  
  jsMin (params) {
    return Api().post('js_mini', params)
  },

  HtmlMin (params) {
    return Api().post('html_mini', params)
  },

  qrCode (params) {
    return Api().post('qrcode', params)
  }
}
