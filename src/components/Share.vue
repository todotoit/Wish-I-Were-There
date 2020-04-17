<template>
  <div class="share-user">
    <div class="share-url">
      <input
        type="text"
        class="share-user-url"
        readonly
        :value="message"
        @click="copyUrl"
        ref="input"
      />
      <button @click="copyUrl" class="white">{{$t('phase05Share')}}</button>
      <transition name="fade">
        <p v-if="notice" class="notice">{{$t('shareLinkCopied')}}</p>
      </transition>
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
  margin-top: 1rem;
  .share-url {
    margin: 0.5rem auto;
    button {
      width: auto;
      border: 1px solid $col-white;
      color: $col-white;
      background-color: rgba($col-dark, 0.7);
    }
    .share-user-url {
      position: absolute;
      left: -99999%;
      height: 0;
      opacity: 0;
    }
    .notice {
      margin-bottom: 0.5rem;
      width: 100%;
    }
  }
}
</style>
