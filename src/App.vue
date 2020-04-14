<template>
  <div id="app">
    <div class="view" v-show="!$route.meta.explore">
      <router-view v-if="ready" />
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
    },
    isTutorialRoute() {
      return this.$route.meta.tutorial === true
    }
  },
  mounted() {
    if (this.isTutorialRoute)
      this.$router.push("/");
    Promise.all([
      //this.$store.dispatch("bindUsersRef"),
      //this.$store.dispatch("bindPinsRef"),
      this.includeScripts()
    ]).then(() => {
      this.$store.commit("SET_READY", true);
      const userId = this.$cookie.get("daydream_user");
      if (userId) this.$store.dispatch("setCurrentUser", userId);
    });
  },
  methods: {
    includeScripts() {
      if (document.getElementsByClassName("gm-src").length)
        return Promise.resolve();
      return new Promise(resolve => {
        let script = document.createElement("script");
        script.classList.add("gm-src");
        script.onload = () => {
          resolve();
        };
        script.async = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.mapsKey}&libraries=places,geometry`;
        document.head.appendChild(script);
      });
    }
  },
  components: { Map, Info }
};
</script>

<style lang="scss">
.close {
  cursor: pointer;
  pointer-events: all;
}

.copyright {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 11;
  path {
    fill: $col-white;
  }
}

.btn-info {
  position: fixed;
  z-index: 100;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  cursor: pointer;
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

    &:focus {
      outline: none;
    }
  }
}
</style>
