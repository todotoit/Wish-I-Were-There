<template>
  <div id="app">
    <div class="overlay center" v-show="$route.path !== '/explore'">
      <a @click="$router.push('/explore')" class="close">CLOSE</a>
      <router-view />
    </div>
    <Map v-if="ready" />
    <div class="btn-info" @click="info = !info">
      <img v-if="!info" svg-inline class="open" src="@/assets/icons/info.svg" />
      <img v-else svg-inline class="close" src="@/assets/icons/close.svg" />
    </div>
    <Info v-if="info" />
    <img svg-inline class="copyright" src="@/assets/icons/todo-logo.svg" />
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
  computed: {
    ready() {
      return this.$store.state.ready;
    }
  },
  mounted() {
    if (this.$route.path !== "/") this.$router.push("/");
    Promise.all([
      this.$store.dispatch("bindUsersRef"),
      this.$store.dispatch("bindPinsRef"),
      this.includeScripts()
    ]).then(() => {
      this.$store.commit("SET_READY", true);
    });;
    
  },
  methods: {
    includeScripts() {
      if (document.getElementsByClassName("gm-src").length) return Promise.resolve();
      return new Promise(resolve => {
        let script = document.createElement("script");
        script.classList.add("gm-src");
        script.onload = () => {
          resolve()
        };
        script.async = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.mapsKey}&libraries=places`;
        document.head.appendChild(script);
      })
    }
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

.copyright {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translate(-50%, 0);
  path {
    fill: $col-white;
  }
}

.btn-info {
  position: fixed;
  z-index: 101;
  top: 0;
  right: 0;
  padding: 0.5rem;
  width: 60px;
  height: 60px;
  .open {
    width: 100%;
    height: 100%;
    &:focus {
      outline: none;
    }
  }
  .close {
    width: 100%;
    height: 100%;
    path {
      stroke: $col-dark;
    }
    &:focus {
      outline: none;
    }
  }
}
</style>
