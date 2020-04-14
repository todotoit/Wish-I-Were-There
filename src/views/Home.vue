<template>
  <div class="home">
    <div class="view">
      <div class="info">
        <div class="header center">
          <p class="expa-large">{{ $t('title') }}</p>
          <p class="exte-large">{{ $t('intro') }}</p>
        </div>
        <div class="footer">
          <button @click="$router.push('/bubble')">{{ $t('ctaStart') }}</button>
          <p class="exte-small link" @click="$router.push('/explore')">{{ $t('phase03Skip') }}</p>
        </div>
      </div>
      <LanguageSwitch />
    </div>
    <Cover />
  </div>
</template>

<script>
import Cover from "@/components/Cover";
import LanguageSwitch from "@/components/LanguageSwitch";

export default {
  name: "Home",
  components: { Cover, LanguageSwitch }
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
  }
}
</style>
