<template>
  <v-app dark>
    <v-toolbar dense>
      <v-toolbar-title>OpenLayers Sample</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import router from "./router"

export default {
  name: "App",

  goHome() {
    router.push('/')
  },
  
  viewHeatMap () {
    router.push('heat-map')
  },

  viewClusters () {
    router.push('clusters')
  }
};
</script>

<style>
.v-toolbar {
  max-height: 5%;
}
</style>
