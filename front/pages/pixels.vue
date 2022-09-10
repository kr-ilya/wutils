<template>
  <v-container
    fill-height
    fluid
    class="myContainer"
  >
  <v-card class="f2" light>
      <v-card-text class="pa-0">
        <v-carousel
        class="pa-0"
        hide-delimiters
        height='56'
        :cycle="false"
                >
        <v-carousel-item>
            <input :value="colorfilled" class="mincolorfilled cPointer mauto" colspan="2" type="color">
          </v-carousel-item>
          <v-carousel-item>
            <v-btn class="myBtn mauto PXbtnFS" outlined @click="clear">Очистить</v-btn>
          </v-carousel-item>
          <v-carousel-item>
            <div class="mauto flex f-unset">
              <v-text-field
                class="ma-0"
                :light="true"
                id="hex"
                @input="change('hex')"
                @click="copy(hex)"
                :value='hex'
              ></v-text-field>
            <v-icon
                :light="true"
                size="24"
                @click="copy(hex)"
              >
                mdi-content-copy
              </v-icon>
              </div>
          </v-carousel-item>
          <v-carousel-item>
            <div class="mauto flex f-unset">
              <v-text-field
                class="ma-0"
                :light="true"
                id="rgb"
                @input="change('rgb')"
                @click="copy(rgb)"
                :value='rgb'
              ></v-text-field>
            <v-icon
                :light="true"
                size="24"
                @click="copy(rgb)"
              >
                mdi-content-copy
              </v-icon>
              </div>
          </v-carousel-item>
          <v-carousel-item>
            <v-btn class="mauto btnTrans PXbtnFS" :class="!size ? 'myBtn' : 'myBtnSize'" :outlined="!size" @click="sizzing">Исходный размер</v-btn>
          </v-carousel-item>
          <v-carousel-item>
            <v-slider
                class="minsl f-unset"
                :light="true"
                :disabled="disabled"
                :max="10"
                :min="1"
                :step="0.5"
                @input="zooming"
                @change="zooming"
                v-model="zoom"
                append-icon="mdi-magnify-plus"
                prepend-icon="mdi-magnify-minus"
                @click:append="zoomIn"
                @click:prepend="zoomOut"
              ></v-slider>
          </v-carousel-item>
        </v-carousel>
        </v-card-text>
    </v-card>
    <v-layout
    class="myLayout"
      justify-center
      align-center
    >
        <v-flex xs12 fill-height>
        <v-card class="myCard" height="100%" light>
          <div
          v-show="selectimage"
          id="filled"
          class="inputBox"
          @click="inputActive"
          @dragenter="dragenter"
          ondragover="event.preventDefault()"
          @drop.prevent="init"
          @dragleave="dragleave"
          @mouseenter="mouseenter"
          @mouseleave="mouseleave"
          ref="fileee"
          >
            <v-layout class="pointer-events" align-center justify-center column>
            
            <v-icon id="upload" class="display-4">mdi-cloud-upload</v-icon>
            <span class="text-center" style="font-size: 24px; font-weight: 300;">{{ text }}</span>
            <input style="display: none" @change="init" id="inputFileToLoad" type="file"/>
            </v-layout>
          </div>
          <div v-show="!selectimage" class="h100 flex">
            <div class="st-picker__thumbnail mauto" :class="size || sizezoom ? 'origSize' : ''">
                <div v-show="isEnabled" ref="preview" class="st-picker__preview"></div>
                <div id="imagePlaceHolder">
                    <img
                    id="image"
                    :class="size || sizezoom ? 'w-unset' : ''"
                    :src="imageValue"
                    ref="prevewImage"
                    @click="onSelectColor"
                    @mousedown="handleMouseDown"
                    @mousemove="onMouseMove"
                    @mouseover="toggleState"
                    @mouseout="toggleState"
                    />
                    <div v-show="line" ref="lineg" class="line-g line-gr"></div>
                    <div v-show="line" ref="linev" class="line-v line-gr"></div>
                </div>
            </div>
            <canvas id="st-picker__cs" ref="c"></canvas>
        </div>
        </v-card>
      </v-flex>
    </v-layout>
    <v-navigation-drawer
    touchless
    stateless
    class="myDrawer"
    right
    fixed
    permanent
    stateless
    value="true"
    width="166"
    light
  >
        <v-list class="myList" two-line subheader light>
          <v-subheader>Параметры</v-subheader>

          <v-list-item class="pdrl-5">
            <v-list-item-content>
              <v-btn class="m-0auto myBtn PXbtnFS" small outlined @click="clear">Очистить</v-btn>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="pdrl-5">
            <v-list-item-content>
              <input :value="colorfilled" class="colorfilled cPointer" colspan="2" type="color">
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="pdrl-5">
            <v-list-item-content>
              <v-text-field
                id="hex"
                @input="change('hex')"
                @click="copy(hex)"
                :value='hex'
              ></v-text-field>
            </v-list-item-content>
            <v-icon
                size="24"
                @click="copy(hex)"
              >
                mdi-content-copy
              </v-icon>
          </v-list-item>
          <v-list-item class="pdrl-5">
            <v-list-item-content>
              <v-text-field
                id="rgb"
                @input="change('rgb')"
                @click="copy(rgb)"
                :value='rgb'
              ></v-text-field>
            </v-list-item-content>
            <v-icon
                size="24"
                @click="copy(rgb)"
              >
                mdi-content-copy
              </v-icon>
          </v-list-item>
          <v-list-item class="pdrl-5">
            <v-list-item-content>
              <v-btn class="m-0auto btnTrans PXbtnFS" :class="!size ? 'myBtn' : 'myBtnSize'" small :outlined="!size" @click="sizzing">Исходный размер</v-btn>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="pdrl-5">
            <v-list-item-content>
              <v-slider
                :disabled="disabled"
                :max="10"
                :min="1"
                :step="0.5"
                @input="zooming"
                @change="zooming"
                v-model="zoom"
                append-icon="mdi-magnify-plus"
                prepend-icon="mdi-magnify-minus"
                @click:append="zoomIn"
                @click:prepend="zoomOut"
              ></v-slider>
            </v-list-item-content>
          </v-list-item>
        </v-list>
  </v-navigation-drawer>
  <v-snackbar
  v-model="snackbar"
  :color="color"
  :timeout="timeout"
>
  {{ copy_text }}
  <v-icon
  size="16"
  dark
  @click="snackbar = false"
>
  mdi-close-circle
</v-icon>
</v-snackbar>
<v-snackbar
  v-model="size_error"
  :color="color"
  :timeout="timeout"
>
  {{ s_e_text }}
  <v-icon
  class="pl-2"
  size="16"
  dark
  @click="size_error = false"
>
  mdi-close-circle
</v-icon>
</v-snackbar>
<v-snackbar
  v-model="type_file_error"
  :color="color"
  :timeout="timeout"
>
  {{ t_f_e_text }}
  <v-icon
  class="pl-2"
  size="16"
  dark
  @click="type_file_error = false"
>
  mdi-close-circle
</v-icon>
</v-snackbar>
  </v-container>
</template>
<script>
  import {
  mapMutations,
} from 'vuex'
export default {
  head: {
    title: 'Цвет пикселя на фото',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Сервис позволяющий узнать цвет пикселя на картинке онлайн бесплатно' },
      { hid: 'keywords', name: 'keywords', content: 'Цвет, фото, пиксели, color pixels on photo, узнать цвет, colorpicker, колорпикер, определить, цвет, пиксель, бесплатно' }
    ]
  },
  data: function () {
    return {
      sizezoom: false,
      size: false,
      selectimage: true,
      isEnabled: false,
      x: '',
      y: '',
      imageValue: '',
      text: 'Выберите изображение или перетащите его сюда',
      rgb: 'rgb(1,1,1)',
      hex: '#000000',
      colorfilled: 'rgb(255,255,255)',
      snackbar: false,
      size_error: false,
      type_file_error: false,
      copy_text: "Данные скопированы",
      s_e_text: "Максимальный размер файла 5 MB",
      t_f_e_text: "Данный тип файла не поддерживается",
      color: 'cyan darken-2',
      timeout: 3000,
      hexm: '0',
      zoom: 1,
      width: '',
      height: '',
      ok: false,
      disabled: true,
      line: false
    }
  },
  methods: {
     ...mapMutations(['SET_TITLE']),
    inputActive: function(){
      document.getElementById('inputFileToLoad').click()
    },
    sizzing: function(){
      this.size = !this.size
      this.line = false
      var t = this
      if(t.disabled !== true){
        var w = t.$refs.prevewImage.width
        var h =  t.$refs.prevewImage.height
        t.$refs.lineg.style.width = w + 'px'
        t.$refs.linev.style.height = h + 'px'
      }
    },
    clear: function(){
      this.selectimage = true
    },
    mouseenter: function(){
      document.getElementById('upload').style.color = '#1867c0';
    },
    mouseleave: function(){
      document.getElementById('upload').style.color = 'rgba(0,0,0,.54)';
    },
    dragenter: function(e){
      var filesSelected = e.target.files || e.dataTransfer.files;
      document.getElementById('upload').style.color = '#1867c0';
      document.getElementById('filled').style.backgroundColor = '#bbbbbb22';
    },
    dragleave: function(e){
      var filesSelected = e.target.files || e.dataTransfer.files;
      document.getElementById('upload').style.color = 'rgba(0,0,0,.54)';
      document.getElementById('filled').style.backgroundColor = '';
    },
    toggleState: function () {
      this.isEnabled = !this.isEnabled
    },
    init: function () {
      event.preventDefault();
      var filesSelected = event.target.files || event.dataTransfer.files;
      var maxFileSize = 5242880; //5MB
      if (filesSelected[0].size <= maxFileSize){
        if((filesSelected[0].type == 'image/png') || (filesSelected[0].type == 'image/jpeg')){
      var that = this
      this.selectimage = false
        var fileReader = new FileReader()
        fileReader.onload = function (fileLoadedEvent) {
          var srcData = fileLoadedEvent.target.result // <--- data: base64
          that.imageValue= srcData
          document.getElementById('image').onload = function(){
              that.disabled = false
              document.getElementById('image').removeAttribute('width')
              document.getElementById('image').removeAttribute('height')
              that.width = that.$refs.prevewImage.width
              that.height = that.$refs.prevewImage.height
          }
        }
        fileReader.readAsDataURL(filesSelected[0])
        }else{
          this.type_file_error = true
        }
      }else{
        this.size_error = true
      }
    },
    useCanvas: function (image, callback) {
      this.$refs.c.width = this.$refs.prevewImage.width
      this.$refs.c.height = this.$refs.prevewImage.height
      // draw image in canvas tag
      this.$refs.c.getContext('2d')
        .drawImage(this.$refs.prevewImage, 0, 0, this.$refs.prevewImage.width, this.$refs.prevewImage.height)
      return callback()
    },
    onMouseMove: function (e) {
      var x, y
      if (!this.isEnabled) return
        x = e.offsetX
        y = e.offsetY
        x = Math.round(e.target.width  / e.target.scrollWidth  * x)
        y = Math.round(e.target.height / e.target.scrollHeight * y)
      var that = this
      var img = that.$refs.prevewImage
      this.useCanvas(this.$refs.prevewImage, function () {
        var p = that.$refs.c.getContext('2d').getImageData(x, y, 1, 1).data
        that.$refs.preview.style.background = that.rgbToHex(p[ 0 ], p[ 1 ], p[ 2 ])
        that.$refs.preview.style.top = y + (y  > img.height -115 ? -100 : 0) + 'px'
        that.$refs.preview.style.left = x + (x  > img.width -125 ? -115 : 15) + 'px'
      })
    },
    onSelectColor: function (e) {
      var x, y
      this.isEnabled = true
      e.preventDefault()
        x = e.offsetX
        y = e.offsetY
      var that = this
      this.useCanvas(this.$refs.prevewImage, function () {
        // get image data
        var pOne = that.$refs.c.getContext('2d').getImageData(x, y, 1, 1).data
        that.colorfilled = that.rgbToHex(pOne[ 0 ], pOne[ 1 ], pOne[ 2 ]);
        that.hex = that.rgbToHex(pOne[ 0 ], pOne[ 1 ], pOne[ 2 ]);
        that.rgb = "rgb("+ pOne[ 0 ] + ', ' + pOne[ 1 ] + ', ' + pOne[ 2 ] + ")";
        that.line = true
        that.$refs.lineg.style.width = that.$refs.prevewImage.width + 'px'
        that.$refs.linev.style.height = that.$refs.prevewImage.height + 'px'
        that.$refs.lineg.style.top = y + 'px'
        that.$refs.linev.style.left = x + 'px'
      })
    },
    rgbToHex: function (r, g, b) {
      return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)
    },
    componentToHex (c) {
      var hex = c.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    },
    handleMouseDown (e) {
      this.onSelectColor(e)
      window.addEventListener('mousemove', this.onSelectColor)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseUp (e) {
      this.unbindEventListeners()
    },
    unbindEventListeners () {
      window.removeEventListener('mousemove', this.onSelectColor)
      window.removeEventListener('mouseup', this.handleMouseUp)
    },
    copy (type) {
      var t = this
      this.$copyText(type).then(function (e) {
        t.snackbar = true
      })
    },
    change (type){
      if(type == 'hex'){
        var val = document.getElementById('hex').value
        const regex = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i;
        const a = regex.exec(val);
        if(a !== null){
        var red = parseInt(a[1], 16);
        var green = parseInt(a[2], 16);
        var blue = parseInt(a[3], 16);
        this.colorfilled = red + green + blue
        this.colorfilled = val
        }
      }else{
        var val = document.getElementById('rgb').value
        this.colorfilled = val
        const regex = /(\d+),(\d+),(\d+),?(\d+)?/;
        const a = regex.exec(val);
        if(a !== null){
        var r = parseInt(a[1]).toString(16);
        var g = parseInt(a[2]).toString(16);
        var b = parseInt(a[3]).toString(16);
        r = r.length === 1 ? '0' + r : r
        g = g.length === 1 ? '0' + g : g
        b = b.length === 1 ? '0' + b : b
        var hex = '#' + r + g + b
        this.colorfilled = hex
        this.hex = hex
        }
      }

    },
    zooming (){
      var t = this
      this.line = false
      if(t.width == '' || t.height == ''){
        t.zoom = 1
      }
      t.zoom == 1 ? this.sizezoom = false : this.sizezoom = true
      var w = t.width
      var h = t.height
      var new_w = w * t.zoom
      var new_h = h * t.zoom
      t.$refs.lineg.style.width = new_w + 'px'
      t.$refs.linev.style.height = new_h + 'px'
      t.$refs.prevewImage.width = new_w
      t.$refs.prevewImage.height = new_h
    },
    clear(){
      var t = this
      t.imageValue = ''
      t.selectimage = true
      t.width = ''
      t.height = ''
      t.zoom = 1
      t.ok = false
      t.disabled = true
    },
    zoomOut () {
        this.zoom = (this.zoom - 0.5) || 1
        this.zooming()
    },
    zoomIn () {
      this.zoom = (this.zoom + 0.5) || 5
      this.zooming()
    },
    resize (){
      var t = this
      if(t.disabled !== true){
      var w = t.$refs.prevewImage.width
      var h =  t.$refs.prevewImage.height
      t.$refs.lineg.style.width = w + 'px'
      t.$refs.linev.style.height = h + 'px'
    }
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.resize)
  },
  created () {
    this.SET_TITLE('Цвет пикселя на фото')
  }
}
</script>

<style>
  .line-g{
    cursor: crosshair;
    position: absolute;
    left: 0px;
    width: 100%;
    height: 1px;
    background-color: rgb(0, 0, 255);
  }
  .line-v{
    cursor: crosshair;
    position: absolute;
    top: 0px;
    width: 1px;
    height: 100%;
    background-color: rgb(0, 0, 255);
  }
  .line-gr{
    pointer-events: none;
    background: repeating-linear-gradient(
     45deg,
     #DDD,
     #DDD 7px,
     #222 7px,
     #222 14px
     );
  }
  .minsl{
    width: 50%;
    margin: 12px auto;
  }
  .f-unset{
    flex: unset !important;
  }
  .v-image{
    cursor: unset !important;
  }
  .v-window__prev,
  .v-window__next{
    padding-bottom: 5px;
  }
  .v-window__prev .v-btn__content,
  .v-window__next .v-btn__content {
    color: #1867c0 !important;
  }
  .v-window__prev, .v-window__next{
    background-color: unset !important;
    top: 25% !important;
  }
  .v-responsive__content{
    display: flex;
  }
/* .myIcons{
    padding: 10px;
  }*/
  .cPointer{
    cursor: pointer;
  }
  .colorfilled{
    width: 100%;
    height: 5vh !important;
  }
  .mincolorfilled{
    width: 50%;
    height: 5vh !important;
  }
  .myText{
    padding: 0 10px;
  }
  .flex{
    display: flex;
  }
  .myCard{
    width: 100%;
  }
  .myCard > .v-card__text{
    height: 100%;
  }
  .h100{
    height: 100%;
  }
  .mauto{
    margin: auto;
  }
  .w-unset{
    width: unset !important;
    max-width: unset !important;
  }
  .origSize{
    overflow-x: scroll !important;
  }
  .btnTrans{
    transition: none !important;
  }
@media (max-width: 599px){
  .myDrawer{
    transform: translateX(166px) !important;
  }
  .myLayout{
    margin-right: 0px !important;
    padding-top: 10px;
  }
  .myContainer{
    padding: 2px 16px 66px 16px !important;
  }
  .f2{
    display: block !important;
  }
}
@media (min-width: 600px){
  .f2{
    margin-bottom: 10px;
    background: white;
    text-align: center;
    top: 0px;
    width: 100% !important;
    display: none !important;
  }
}
  .myContainer{
    padding: 16px;
    display: flow-root !important;
  }
  .w100{
    min-width: 100%;
  }
  .m-0auto{
    margin: 0 auto;
  }
  .pdrl-5 > .v-list__item{
    padding: 0 5px !important;
    height: 48px !important;
    margin-bottom: 10px;
  }
  .myList{
    background-color: #fff !important;

  }
  .myLayout{
    margin-right: 156px;
    padding-bottom: 5px !important;
  }
  .myDrawer{
    transform: translateX(0);
    height: calc(100% - 135px) !important;
    top: 70px !important;
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
  }
  .myBtn{
    color: #3f51b5!important;
    caret-color: #3f51b5!important;
  }
  .myBtnSize{
    font-weight: 400 !important;
    color: #fff!important;
    caret-color: #3f51b5!important;
    background-color: #3f51b5!important;
  }
  .pointer-events{
    pointer-events: none;
  }
  .st-picker__thumbnail{
  position:relative;
  display: flex;
}
.st-picker__thumbnail img {
  display: block;
  width: 100%;
  cursor: crosshair;
  max-width: 100%;
}
.st-picker__result{
    margin: 0 auto;
    width: 200px;
  background: #000;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  margin: 0;
  padding: 10px 15px;
  display: block;
}
.st-picker__result span {
  display: block;
  font-size: 13px;
}
.st-picker__preview {
  pointer-events: none;
  position:absolute;
  display:block;
  margin:0;
  padding:0;
  width: 100px;
  height: 100px;
  border: 1px solid #FFF;
}
#st-picker__cs{ 
  display:none;
}
#selected-color {
    border-radius: 20px;
    width: 30px;
    height: 30px;
}

/* demo */
button, input[type="file"] {
    padding: 20px;
    background: #fc0;
    border-radius: 5px;
    font-size: 1em;
    border: none;
}
.inputBox{
    margin: 10px;
    align-items: center;
    border: 1px dashed rgba(0, 0, 0, 0.54);
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    bottom: 0px;
    left: 0px;
    position: absolute;
    right: 0px;
    top: 0px;
}
.pdrl-5{
  min-height: 48px !important;
  margin: 0 !important;
}
.PXbtnFS{
  font-size: 11px !important;
}
#rgb, #hex{
  font-size: 14px !important;
}
</style>