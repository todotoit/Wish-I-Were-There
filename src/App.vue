<template>
  <div id="app">
    <div class="overlay center" v-show="$route.path !== '/explore'">
      <a @click="$router.push('/explore')" class="close">CLOSE</a>
      <router-view />
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
      mapsKey: process.env.VUE_APP_MAPS_KEY,
    };
  },
  mounted() {
    if(this.$route.path !== '/') this.$router.push('/')
    Promise.all([
      this.$store.dispatch("bindUsersRef"),
      this.$store.dispatch("bindPinsRef")
    ]);
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
  background-color: #212121;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
  height: 100%;
}
.close {
  cursor: pointer;
  pointer-events: all;
}
</style>
