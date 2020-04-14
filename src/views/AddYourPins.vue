<template>
  <div class="info">
    <template v-if="!addingMessage">
      <div class="header">
        <p class="large">Where would you be</p>
        <p
          class="medium"
        >Explore the map and pinpoint the first location that comes to mind where you’d really like to be as soon as this is all over. Let everyone know why that very place is meaningful to you – help us dream of a collective daydream.</p>
        <MarkerPlacer type="pin" />
      </div>
      <div class="footer">
        <button @click="addingMessage = true">Place</button>
      </div>
    </template>
    <template v-else-if="!userPin">
      <div class="header">
        <p class="large">Send your message</p>
        <p
          class="medium"
        >Explore the map and pinpoint the first location that comes to mind where you’d really like to be as soon as this is all over. Let everyone know why that is meaningful to you – help us dream of a collective daydream.</p>
        <textarea placeholder="Add your message" v-model="message"></textarea>
      </div>
      <div class="footer">
        <button @click="createNewPin">Publish</button>
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
          this.$router.push('/thankyou')
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
</style>
