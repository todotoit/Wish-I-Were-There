<template>
  <div id="app">
    <div class="overlay center">
      <router-view v-show="false" />
    </div>
    <Map :api-key="mapsKey" />
    <div class="btn-info" @click="info = !info">
      <div class="open" v-if="!info" />
      <div class="close" v-else />
    </div>
    <Info v-if="info" />
  </div>
</template>

<script>
import Map from "@/components/Map/Map";
import Info from "@/components/Info";
export default {
  name: "App",
  data() {
    return {
      mapsKey: process.env.VUE_APP_MAPS_KEY,
      info: false
    };
  },
  mounted() {
    Promise.all([
      this.$store.dispatch("bindUsersRef"),
      this.$store.dispatch("bindPinsRef")
    ]);
  },
  components: { Map, Info }
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

.btn-info {
  position: fixed;
  z-index: 101;
  top: 0;
  right: 0;
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  .open {
    width: 100%;
    height: 100%;
    background-color: red;
  }
  .close {
    width: 100%;
    height: 100%;
    background-color: blue;
  }
}
</style>
