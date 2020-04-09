<template>
  <div class="marker-placer">
    <SearchLocation @change="centerMarker()" />
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
    google.maps.event.addListener(this.map, "click", event => {
      this.updateMarker(event.latLng);
    });
  },
  methods: {
    centerMarker() {
      this.marker.setPosition(this.map.getCenter());
    },
    updateMarker(pos) {
      this.marker.setPosition(pos);
    }
  }
};
</script>

<style>
</style>