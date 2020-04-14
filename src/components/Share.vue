<template>
  <div class="share-user">
    <template v-if="sharing">
      <div class="share-url">
        Use this url to share your daydream
        <input
          type="text"
          class="share-user-url"
          readonly
          :value="url"
          @click="copyUrl"
        />
        <transition name="fade">
          <p
            v-if="notice"
          >Link copied to clipboard, paste it in your favorite social network to share!</p>
        </transition>
      </div>
    </template>
    <button v-else @click="sharing=true">Share your daydream</button>
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
    url() {
      return this.store.getters.getUserUrl(this.user.id)
    }
  },
  methods: {
    copyUrl(e) {
      e.target.select();
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
    .share-user-url {
      display: block;
      margin: 0;
      text-transform: lowercase;
    }
  }
}
</style>