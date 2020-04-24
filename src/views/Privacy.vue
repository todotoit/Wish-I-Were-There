<template>
  <section class="privacy">
    <div class="content" v-html="$t('privacyPolicy')">
    </div>
  </section>
</template>

<script>
export default {};
</script>

<style lang="scss">
section.privacy {
  text-align: left;
  padding: 1rem;
  overflow: auto;
  width: 100%;
  pointer-events: all;
  a {
    text-transform: none;
  }
  .content {
    max-width: 960px;
    margin: 0 auto;
    p,
    li {
      margin: 0.8rem 0;
    }
  }
}
</style>