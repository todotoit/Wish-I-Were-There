<template>
  <div class="home">
    <div class="view" v-if="step == 0">
      <div class="info">
        <div class="header center">
          <p class="expa-large ct-font">{{ $t('title') }}</p>
          <p class="exte-large">{{ $t('intro') }}</p>
        </div>
        <div class="footer">
          <button @click="next">{{ $t('ctaStart') }}</button>
          <p class="exte-small link" @click="$router.push('/explore')">{{ $t('phase03Skip') }}</p>
        </div>
      </div>
      <LanguageSwitch />
    </div>
    <div class="view" v-else>
      <div class="info">
        <div class="header center">
          <img svg-inline class="logo" src="@/assets/icons/cookie.svg" />
          <p class="exte-large">{{ $t('cookieDesc') }}</p>
        </div>
        <div class="footer">
          <button @click="$router.push('/bubble')">{{ $t('cookieBtn') }}</button>
        </div>
      </div>
      <LanguageSwitch />
    </div>
    <Cover class="shader-bg" />
  </div>
</template>

<script>
import Cover from "@/components/Cover";
import LanguageSwitch from "@/components/LanguageSwitch";

export default {
  name: "Home",
  components: { Cover, LanguageSwitch },
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

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  z-index: 500;
  background-color: #1d1b26;
  .view {
    .info {
      width: 60%;
      @media screen and (max-width: $mqTablet) {
        width: 95%;
        padding-top: 0;
        margin-top: 1rem;
      }
    }
    pointer-events: all;
    .header {
      .ct-font {
        font-size: 3.5rem;
        @media screen and (max-width: $mqTablet) {
          font-size: 3.2rem;
        }
        @media screen and (max-width: $mqMobile) {
          font-size: 2rem;
        }
      }
      align-items: center;
      svg {
        outline: none;
        user-select: none;
        margin-bottom: 2rem;
      }
    }
  }
}
</style>
