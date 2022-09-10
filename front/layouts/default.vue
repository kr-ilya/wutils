<template>
  <v-app>
        <Toolbar />

        <Drawer />
        <v-content>
          <div id="core-view" :class=" $route.path === '/pixels' ? 'colorPixel' : '' ">
            <v-fade-transition mode="out-in">
              <nuxt />
            </v-fade-transition>
          </div>
          <Footer />
        </v-content>
  </v-app>
</template>

<script>
import Toolbar from '~/components/core/Toolbar.vue'
import Drawer from '~/components/core/Drawer.vue'
import Footer from '~/components/core/Footer.vue'

export default {
  components: {
    Toolbar,
    Drawer,
    Footer
  }
}

</script>
<style>
#core-view {
  padding-bottom: 100px;
}

.colorPixel{
  padding-bottom: 50px !important;
  height: 100%;
}

.v-content{
  background-color: #eee !important;
}

#core-view .container{
  padding: 10px 24px;
}

@media only screen and (max-width: 959px){
#core-view .container {
    padding: 10px 16px;
  }
}
</style>