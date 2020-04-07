<template>
  <div id="app">
    <div class="overlay center">
      <router-view />
    </div>
    <Map :api-key="mapsKey" />
  </div>
</template>

<script>
import Map from "@/components/Map";
export default {
  name: "App",
  data() {
    return {
      mapsKey: process.env.VUE_APP_MAPS_KEY
    }
  },
  mounted() {
    console.log(process.env)
  },
  components: { Map }
};
</script>

<style lang="scss">
/* Optional: Makes the sample page fill the window. */
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
