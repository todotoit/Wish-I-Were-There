<template>
  <div class="home">
    <div class="view-content">
      <LanguageSwitch />
      <header>
        <h2 class="expa-large">{{ $t('title') }}</h2>
        <p class="exte-medium" v-html="$t('intro')"></p>
      </header>
      <footer>
        <transition name="fade" mode="out-in">
          <div v-if="ready">
            <button @click="$router.push('/cookies')">{{ cta }}</button>
            <a @click="$router.push('/explore')">{{ $t('phase03Skip') }}</a>
          </div>
          <div v-else class="data-loading">
            <Loader />
            <p>loading map data</p>
          </div>
        </transition>
      </footer>
    </div>
    <transition name="fade">
      <HomeAnimations />
    </transition>
  </div>
</template>

<script>
import LanguageSwitch from "@/components/LanguageSwitch";
import HomeAnimations from "@/components/HomeAnimations";
import SingleLoader from "@/components/SingleLoader";

export default {
  name: "Home",
  components: { LanguageSwitch, HomeAnimations, Loader: SingleLoader },
  data() {
    return {
      step: 0
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    pin() {
      return this.$store.state.userPins;
    },
    ready() {
      return this.$store.state.ready;
    },
    cta() {
      if (this.pin) return this.$t("ctaHasPin");
      else if (this.user) return this.$t("ctaHasUser");
      else return this.$t("ctaStart");
    }
  },
  methods: {
    next() {
      if (this.user) return this.$router.push("/explore");
      else this.step = 1;
    }
  }
};
</script>

<style lang="scss">
.home {
  header {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    svg {
      margin-bottom: 1rem;
    }
  }
  footer {
    min-height: 90px;
    .data-loading {
      p {
        color: $col-green;
      }
      svg {
        stroke: $col-green;
        stroke-width: 4;
      }
    }
  }
}
</style>
