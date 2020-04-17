<template>
  <div class="home">
    <template>
      <div class="view-content" v-if="step==0">
          <LanguageSwitch />
        <header>
          <h2 class="expa-large">{{ $t('title') }}</h2>
          <p class="exte-medium">{{ $t('intro') }}</p>
        </header>
        <footer>
          <button @click="next">{{ $t('ctaStart') }}</button>
          <a @click="$router.push('/explore')">{{ $t('phase03Skip') }}</a>
        </footer>
      </div>
      <div class="view-content" v-else>
        <header>
          <img svg-inline class="logo" src="@/assets/icons/cookie.svg" />
          <p class="exte-large">{{ $t('cookieDesc') }}</p>
        </header>
        <footer>
          <button @click="$router.push('/bubble')">{{ $t('cookieBtn') }}</button>
        </footer>
      </div>
    </template>
    <HomeAnimations />
  </div>
</template>

<script>
import LanguageSwitch from "@/components/LanguageSwitch";
import HomeAnimations from "@/components/HomeAnimations";

export default {
  name: "Home",
  components: { LanguageSwitch, HomeAnimations },
  data() {
    return {
      step: 0
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
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
}
</style>
