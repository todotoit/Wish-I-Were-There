<template>
  <div class="cookies">
    <div class="view-content">
      <header>
        <img svg-inline class="logo" src="@/assets/icons/cookie.svg" />
        <p class="exte-large">{{ $t('cookieDesc') }}</p>
        <a href="/privacy" target="_blank">{{ $t('privacyLink') }}</a>
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
  }
  a {
    margin-bottom: 0.5rem;
  }
}
</style>
