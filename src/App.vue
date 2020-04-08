<template>
  <div id="app">
    <div class="overlay center">
      <router-view v-show="false" />
    </div>
    <Map :api-key="mapsKey" />
  </div>
</template>

<script>
import Map from "@/components/Map/Map";
export default {
  name: "App",
  data() {
    return {
      mapsKey: process.env.VUE_APP_MAPS_KEY
    }
  },
  components: { Map }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
