<template>
  <div id="app">
    <transition name="fade">
      <Loader v-if="!loaded" />
      <div class="container" v-else>
        <div class="view" v-show="!isExplore">
          <router-view v-if="ready" />
        </div>
        <Map v-if="ready" v-show="!info && (isExplore || isTutorial)" />
        <div class="btn-info" @click="info = !info" v-show="isExplore">
          <img v-if="!info" svg-inline class="open" src="@/assets/icons/info.svg" />
          <img v-else svg-inline class="close" src="@/assets/icons/close.svg" />
        </div>
        <Info v-if="info" />
        <footer v-if="showFooter">
          <a target="_blank" class="exte-medium todo-logo" href="https://todo.to.it/">
            <img svg-inline src="@/assets/icons/todo-logo.svg" />
          </a>
        </footer>
      </div>
    </transition>
    <Cover class="shader-bg" v-if="info || (!isExplore && !isTutorial)" />
    <div class="assets-preload">
      <img src="@/assets/img/bubbles/bubbles-expanded.png" />
      <img src="@/assets/img/bubbles/bubbles-gradient.png" />
    </div>
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
    },
    showFooter() {
      return (
        !this.info &&
        (!this.$mq.includes("sm") || (!this.isExplore && !this.isTutorial))
      );
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
#app {
  overflow: hidden;
  width: 100%;
}
.close {
  cursor: pointer;
  pointer-events: all;
}

.container > footer {
  width: 100%;
  position: fixed;
  padding: 0 $spacing/6;
  bottom: 0;
  pointer-events: none;
  right: 0;
  text-align: center;
  z-index: 600;
  @media screen and (min-width: $mqTablet) {
    padding-bottom: 0.5rem;
  }
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
  top: $spacing/2;
  right: $spacing/3;
  width: 2.5rem;
  @media screen and (max-width: $mqTablet) {
    width: 2.5rem;
  }
  z-index: 202;
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
  left: -1000%;
  pointer-events: none;
  opacity: 0;
  z-index: -9999;
}
.container,
.loader {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 100;
}
</style>
