<template>
  <div id="app">
    <transition name="fade">
      <Loader v-if="!loaded" />
      <div class="wrapper" v-else>
        <div class="view" v-show="!isExplore">
          <router-view v-if="ready" />
        </div>
        <Map v-if="ready" v-show="!info && (isExplore || isTutorial)" />
        <div class="btn-info" @click="info = !info" v-show="isExplore">
          <img v-if="!info" svg-inline class="open" src="@/assets/icons/info.svg" />
          <img v-else svg-inline class="close" src="@/assets/icons/close.svg" />
        </div>
        <Info v-if="info" />
        <footer v-if="!info">
          <a target="_blank" class="exte-medium todo-logo" href="https://todo.to.it/">
            <img svg-inline src="@/assets/icons/todo-logo.svg" />
          </a>
        </footer>
        <div class="assets-preload">
          <img src="@/assets/img/bubbles/bubbles-expanded.png" />
          <img src="@/assets/img/bubbles/bubbles-gradient.png" />
        </div>
      </div>
    </transition>
    <Cover class="shader-bg" v-if="info || (!isExplore && !isTutorial)"/>
  </div>
</template>

<script>
import Map from "@/components/Map/Map";
import Info from "@/components/Info";
import Loader from "@/components/Loader";
import Cover from "@/components/Cover";
export default {
  name: "App",
  components: { Map, Info, Loader, Cover },
  data() {
    return {
      mapsKey: process.env.VUE_APP_MAPS_KEY,
      info: false,
      loaded: false
    };
  },
  computed: {
    ready() {
      return this.$store.state.ready;
    },
    isExplore() {
      return this.$route.meta.explore === true;
    },
    isTutorial() {
      return this.$route.meta.tutorial === true;
    }
  },
  mounted() {
    if (document.readyState === "complete") this.init();
    else {
      document.onreadystatechange = () => {
        if (document.readyState === "complete") {
          this.init();
        }
      };
    }
    if (this.isTutorial) this.$router.push("/");
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
    init() {
      setTimeout(() => (this.loaded = true), 1000);
    },
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
  }
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
.assets-preload {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
  z-index: -9999;
}
.wrapper,
.loader {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 100;
}
</style>
