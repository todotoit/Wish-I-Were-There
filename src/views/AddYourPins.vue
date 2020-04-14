<template>
  <div class="info">
    <template v-if="!addingMessage">
      <div class="header">
        <p class="expa-large">{{ $t('phase03Title') }}</p>
        <p class="exte-medium">{{ $t('phase03Desc') }}</p>
        <MarkerPlacer type="pin" :placeholder="$t('phase03Input')" />
      </div>
      <div class="footer">
        <button @click="addingMessage = true">{{ $t('phase03Btn') }}</button>
        <p class="exte-small" @click="$router.push('/explore')">{{ $t('phase03Skip') }}</p>
      </div>
    </template>
    <template v-else-if="!userPin">
      <div class="header">
        <p class="expa-large">{{ $t('phase04Title') }}</p>
        <p class="exte-medium">{{ $t('phase04Desc') }}</p>
        <textarea :placeholder="$t('phase04Input')" v-model="message"></textarea>
      </div>
      <div class="footer">
        <button @click="createNewPin">{{ $t('phase04Btn') }}</button>
      </div>
    </template>
    <template v-else>
      <div class="header">
        <p class="expa-large">{{ $t('phase05Title') }}</p>
        <p class="exte-medium">{{ $t('phase05Desc') }}</p>
      </div>
      <div class="footer">
        <button @click="$router.push('/explore')">{{ $t('phase05Btn') }}</button>
      </div>
    </template>
  </div>
</template>

<script>
import MarkerPlacer from "@/components/MarkerPlacer.vue";

export default {
  name: "FindYourBubble",
  components: { MarkerPlacer },
  data() {
    return {
      message: "",
      addingMessage: false,
      messageUpdated: false
    };
  },
  computed: {
    marker() {
      return this.$store.state.marker;
    },
    user() {
      return this.$store.state.user;
    },
    map() {
      return this.$store.state.map;
    },
    userPin() {
      return this.$store.state.userPins;
    },
    placing() {
      return this.$store.state.placing;
    }
  },
  mounted() {
    this.map.setZoom(13);
  },
  methods: {
    createNewPin() {
      this.$store
        .dispatch("createNewPin", {
          user: this.user,
          message: this.message,
          marker: this.marker
        })
        .then(r => {
          this.$store.commit("SET_USER_PINS", r);
          this.$store.commit("SET_PLACING", false);
          this.map.setCenter(r.marker.getPosition());
          this.$router.push("/thankyou");
        });
    },
    updatePinMessage() {
      if (!this.message) return;
      this.$store
        .dispatch("updatePin", {
          message: this.message
        })
        .then(r => {
          this.messageUpdated = true;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.pin-placer {
  height: 100%;
  pointer-events: none;
}
p {
  margin-bottom: $spacing;
}
.footer {
  pointer-events: all;
  p {
    cursor: pointer;
  }
}
</style>
