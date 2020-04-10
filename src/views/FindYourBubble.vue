<template>
  <div class="info">
    <template v-if="!user && step == 0">
      <div class="header">
        <p class="large">What's your name</p>
        <p
          class="medium"
        >We are naming a galaxy here! Add all of your family names, your childhood pet’s one, or just stay anonymous.</p>
        <input type="text" v-model="name" placeholder="Your name here (optional)" />
      </div>
      <div class="footer">
        <button @click="next">Next</button>
      </div>
    </template>
    <template v-else-if="!user && step == 1">
      <div class="header">
        <p class="large">Where are you ?</p>
        <p
          class="medium"
        >Pinpoint the location where you are currently spending all these days self-quarantine during the Covid19 pandemic. A bit like in space, everyone of us is living in a galaxy of their own – feeling closeby but actually light years away.</p>
        <MarkerPlacer />
      </div>
      <div class="footer">
        <button @click="prev">Back</button>
        <button @click="createNewBubble()">Place your bubble</button>
      </div>
    </template>
    <template v-else>
      <div class="header">
        <p class="large">Your Microcosm</p>
        <p class="medium">According to Italian extraordinary health regulations most regional governments are currently permitting their citizens to move freely, have walks and take in fresh air only within the linear 200mt surrounding  their residence.</p>
      </div>
      <div class="footer">
        <button @click="$router.push('/pins')">Next</button>
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
      step: 0,
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
    if (this.$store.state.user) return this.$router.push("/explore");
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
    },
    next() {
      this.step = 1;
    },
    prev() {
      this.step = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  margin-bottom: $spacing;
}
</style>
