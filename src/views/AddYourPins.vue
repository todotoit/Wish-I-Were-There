<template>
  <div class="pin-placer panel">
    <div class="pin-editor editor">
      <template v-if="!placing">
        <header>
          <h3>What’s the first place you’d like to go to, when all of this is over?</h3>
          <p>In such times of restlessness, where catching a breath while going grocery shopping becomes the highlight of the day, we all dream of the places we’d like to get to, as soon as the quarantine is over. Explore the map and pinpoint your location and why that is meaningful to you – help us dream of a collective daydream.</p>
        </header>
        <footer>
          <p>
            <button @click="placing = true">Place your pin</button>
          </p>
          <p>
            <button @click="$router.push('/explore')">Explore the map</button>
          </p>
        </footer>
      </template>
      <template v-else-if="!userPin">
        <header>
          <h3>ADD A DAYDREAM PIN</h3>
          <MarkerPlacer />
        </header>
        <footer>
          <p>
            <button @click="createNewPin">Place</button>
          </p>
          <p>
            <button @click="$router.push('/explore')">Explore the map</button>
          </p>
        </footer>
      </template>
      <template v-else-if="!messageUpdated">
        <header>
          <h3>ADD A DAYDREAM PIN</h3>
          <p>If you want, you can add a message to your daydream pin</p>
          <textarea placeholder="Add your message" v-model="message"></textarea>
        </header>
        <footer>
          <p>
            <button @click="updatePinMessage">Add your message</button>
          </p>
          <p>
            <button @click="$router.push('/explore')">Explore the map</button>
          </p>
        </footer>
      </template>
      <template v-else>
        <header>
          <h3>You're done!</h3>
        </header>
        <footer>
          <p>
            <button @click="$router.push('/explore')">Explore the map</button>
          </p>
        </footer>
      </template>
    </div>
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
      placing: false,
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
    }
  },
  mounted() {
    this.map.setZoom(12);
  },
  methods: {
    createNewPin() {
      this.$store
        .dispatch("createNewPin", {
          user: this.user,
          message: "",
          marker: this.marker
        })
        .then(r => {
          console.log(r);
          this.$store.commit("SET_USER_PINS", r);
          this.map.setCenter(r.marker.getPosition());
        });
    },
    updatePinMessage() {
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
</style>
