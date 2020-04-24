<template>
  <section class="privacy">
    <LanguageSwitch class="language-switch" />
    <header>
      <p class="exte-small project-name" @click="$router.push('/')">Wish I Were There</p>
    </header>
    <div class="content">
      <div class="intro">
        <h3>{{ $t('privacyIntroTitle') }}</h3>
        <div v-html="$t('privacyIntroText')"></div>
        <h3>{{ $t('privacyHowItWorksTitle') }}</h3>
        <div v-html="$t('privacyHowItWorksText')"></div>
      </div>
      <h2 class="expa-large">Privacy policy</h2>
      <div class="privacy-policy" v-html="$t('privacyPolicy')"></div>
      <h2 class="expa-large">Cookie policy</h2>
      <div class="privacy-policy" v-html="$t('cookiePolicy')"></div>
    </div>
  </section>
</template>

<script>
import LanguageSwitch from "@/components/LanguageSwitch";

export default {
  components: { LanguageSwitch }
};
</script>

<style lang="scss">
section.privacy {
  text-align: left;
  padding: 1rem;
  overflow: auto;
  width: 100%;
  pointer-events: all;
  background-color: $col-dark;
  h2 {
    text-align: center;
    margin-top: 2rem;
  }
  h3 {
    text-align: center;
    color: $col-green;
  }
  h4 {
    text-align: center;
    margin-top: 0;
  }
  .language-switch {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  header {
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-bottom: 3rem;
  }
  .intro {
    text-align: center;
  }
  .project-name {
    cursor: pointer;
    text-transform: uppercase;
    color: $col-green;
  }
  a {
    text-transform: none;
    color: $col-green;
  }
  .content {
    max-width: 840px;
    margin: 0 auto;
    p,
    li {
      margin: 0.8rem 0;
    }
  }
}
</style>