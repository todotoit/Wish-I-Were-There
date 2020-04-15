<template>
  <div class="share-user">
    <div class="share-url">
      <transition name="fade">
        <p v-if="notice">{{$t('shareLinkCopied')}}</p>
      </transition>
      <input
        type="text"
        class="share-user-url"
        readonly
        :value="message"
        @click="copyUrl"
        ref="input"
      />
      <button @click="copyUrl">{{$t('phase05Share')}}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Share",
  data() {
    return {
      notice: false,
      noticeTimeout: null,
      sharing: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    pin() {
      return this.$store.getters.getUserPin(this.user.id);
    },
    message() {
      return this.$t("shareMessage", {
        url: this.$store.getters.getUserUrl(this.user.id),
        msg: this.pin.message
      });
    }
  },
  methods: {
    copyUrl() {
      this.$refs.input.select();
      document.execCommand("copy");
      this.notice = true;
      clearTimeout(this.noticeTimeout);
      this.noticeTimeout = setTimeout(() => (this.notice = false), 4000);
    }
  }
};
</script>

<style lang="scss">
.share-user {
  .share-url {
    margin-top: 1rem;
    position: absolute;
    bottom: 5rem;
    left: 50%;
    transform: translate(-50%, 0);
    button {
      border: 1px solid $col-white;
      color: $col-white;
    }
    @media screen and (max-width: $mqTablet) {
      bottom: 3.5rem;
    }
    .share-user-url {
      height: 0;
      opacity: 0;
    }
  }
}
</style>
