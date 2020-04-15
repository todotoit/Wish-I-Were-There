<template>
  <div class="home">
    <div class="view" v-if="step == 0">
      <div class="info">
        <div class="header center">
          <p class="expa-large">{{ $t('title') }}</p>
          <p class="exte-large">{{ $t('intro') }}</p>
        </div>
        <div class="footer">
          <button @click="step = 1">{{ $t('ctaStart') }}</button>
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
    pointer-events: all;
    .header {
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
