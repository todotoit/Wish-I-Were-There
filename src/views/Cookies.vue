<template>
  <div class="cookies">
    <div class="view-content">
      <header>
        <img svg-inline class="logo" src="@/assets/icons/cookie.svg" />
        <p class="exte-large" v-html="$t('cookieDesc')"></p>
        <a href="/privacy" class="privacy-policy" target="_blank">{{ $t('privacyLink') }}</a>
      </header>
      <footer>
        <button @click="$router.push('/bubble')">{{ $t('cookieBtn') }}</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cookies"
};
</script>

<style lang="scss">
.cookies {
  header {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    svg {
      margin-bottom: 1rem;
    }
    a.privacy-policy {
      display: block;
      margin-bottom: 0.5rem;
      color: $col-green;
      margin-top: 1rem;
    }
  }
  p {
    margin-bottom: 0.5rem;
  }
}
</style>
