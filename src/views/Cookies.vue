<template>
  <div class="cookies">
    <div class="policy-container" v-if="privacy">
      <div class="close" @click="privacy=false">
        <img src="@/assets/icons/close.svg" svg-inline />
      </div>
      <Privacy />
    </div>
    <div class="view-content">
      <header>
        <img svg-inline class="logo" src="@/assets/icons/cookie.svg" />
        <p class="exte-large" v-html="$t('cookieDesc')"></p>
        <a @click="privacy = true" class="privacy-policy">{{ $t('privacyLink') }}</a>
      </header>
      <footer>
        <button @click="$router.push('/bubble')">{{ $t('cookieBtn') }}</button>
      </footer>
    </div>
  </div>
</template>

<script>
import Privacy from "@/views/Privacy";

export default {
  name: "Cookies",
  components: { Privacy },
  data() {
    return {
      privacy: false
    };
  }
};
</script>

<style lang="scss">
.cookies {
  .policy-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    pointer-events: all;
    .privacy {
      overflow: auto;
      height: 100%;
    }
    .close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 10;
      svg {
        width: 2.5rem;
      }
    }
  }
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
