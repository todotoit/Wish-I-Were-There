<template>
  <div class="home panel">
    <h2>Mappette</h2>
    <p>Place the pin in the location where you are spending this time of self-quarantine</p>
    <MarkerPlacer v-if="ready" />
    <p>If you want, tell us your name (leave empty if you prefer to remain anonymous)</p>
    <p><input type="text" v-model="name" placeholder="Your name" /></p>
    <button @click="createNewBubble()">Place your bubble</button>
  </div>
</template>

<script>
import MarkerPlacer from "@/components/MarkerPlacer.vue";

export default {
  name: "FindYourBubble",
  components: { MarkerPlacer },
  data() {
    return {
      name: ''
    }
  },
  computed: {
    ready() {
      return this.$store.state.ready;
    },
    marker() {
      return this.$store.state.marker
    }
  },
  methods: {
    createNewBubble() {
      this.$store.dispatch('createNewUser', {name: this.name, marker: this.marker}).then(r => console.log(r))
    }
  }
};
</script>
