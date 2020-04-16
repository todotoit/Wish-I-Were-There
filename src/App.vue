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
    <footer v-if="!info">
      <a target="_blank" class="exte-medium todo-logo" href="https://todo.to.it/">
        <img svg-inline src="@/assets/icons/todo-logo.svg" />
      </a>
    </footer>
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
      return this.$route.meta.tutorial === true;
    }
  },
  mounted() {
    if (this.isTutorialRoute) this.$router.push("/");
    Promise.all([
      this.$store.dispatch("bindUsersRef"),
      this.$store.dispatch("bindPinsRef"),
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

footer {
  width: 100%;
  position: fixed;
  bottom: 1rem;
  pointer-events: none;
  @media screen and (max-width: $mqMobile) {
    bottom: 0.2rem;
  }
  left: 0;
  text-align: center;
  z-index: 600;
  a {
    pointer-events: all;
  }
  svg {
    @media screen and (max-width: $mqTablet) {
      width: 70px;
    }
  }
  svg path {
    fill: $col-white;
  }
}

.btn-info {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  @media screen and (max-width: $mqTablet) {
   width: 2rem;
  }
  z-index: 202;
  @media screen and (max-width: $mqMobile) {
    top: 0.5rem;
    right: 0.5rem;
  }
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
