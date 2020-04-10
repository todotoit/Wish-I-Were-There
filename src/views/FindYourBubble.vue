<template>
  <div class="bubble-placer panel">
    <div class="bubble-editor editor">
      <template v-if="!user">
        <header>
          <h3>Where are you self-quarantining?</h3>
          <p>Place the pin in the location where you are spending this time of self-quarantine</p>
          <MarkerPlacer />
        </header>
        <footer>
          <p>If you want, tell us your name (leave empty if you prefer to remain anonymous)</p>
          <p>
            <input type="text" v-model="name" placeholder="Your name" />
          </p>
          <button @click="createNewBubble()">Place your bubble</button>
        </footer>
      </template>
      <template v-else>
        <header>
          <h3>Here's your bubble</h3>
          <p>According to Italian regulations most regional governments allow their citizens to move within the 200 mt surrounding their place of self-quarantine</p>
        </header>
        <footer>
          <p>
            <button @click="$router.push('/pins')">Next</button>
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
      name: ""
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
    }
  },
  mounted() {
    if(this.$store.state.user) return this.$router.push('/explore')
    this.$store.commit("SET_PLACING", true);
  },
  methods: {
    createNewBubble() {
      this.$store
        .dispatch("createNewUser", { name: this.name, marker: this.marker })
        .then(r => {
          this.$store.commit("SET_PLACING", false);
          this.$store.commit("SET_USER", r);
          this.map.setCenter(r.marker.getPosition());
          this.map.setZoom(17);
          this.$cookie.set("daydream_user", r.id, { expires: "1Y" });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.bubble-placer {
  height: 100%;
  pointer-events: none;
}
</style>
