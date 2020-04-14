<template>
  <div class="home">
    <div class="view">
      <div class="info">
        <div class="header center">
          <p class="large">Mappette Project</p>
          <p class="medium">{{ $t('intro') }}</p>
        </div>
        <div class="footer">
          <button @click="$router.push('/bubble')">Let's Go</button>
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
  z-index: 999;
  background-color: #1d1b26;
  .view {
    pointer-events: all;
  }
}
.info {
  p {
    margin-bottom: $spacing;
  }
}
.language-switch {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>
