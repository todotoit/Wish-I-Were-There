<template>
  <div class="marker-placer">
    <SearchLocation @change="updateMarker()" />
  </div>
</template>

<script>
import SearchLocation from "@/components/SearchLocation";

export default {
  name: "MarkerPlacer",
  components: { SearchLocation },
  computed: {
    map() {
      return this.$store.state.map;
    },
    marker() {
      return this.$store.state.marker;
    }
  },
  mounted() {
    const marker = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map,
      draggable: true
    });
    this.$store.commit("SET_MARKER", marker);
  },
  methods: {
    updateMarker() {
      this.marker.setPosition(this.map.getCenter());
    }
  }
};
</script>

<style>
</style>