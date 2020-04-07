<template>
  <div class="map-container">
    <div id="map" ref="map"></div>
  </div>
</template>

<script>
export default {
  name: "Map",
  props: {
    apiKey: {
      type: String,
      required: true
    }
  },
  mounted() {
    let script = document.createElement("script");
    script.onload = () => {
      this.$emit("ready");
      this.init();
    };
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;
    document.head.appendChild(script);
  },
  methods: {
    init() {
      var map;
      map = new google.maps.Map(this.$refs.map, {
        center: { lat: 45.060285, lng: 7.680763 },
        zoom: 15,
        mapTypeId: 'roadmap',
        disableDefaultUI: true
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.map-container, #map {
  height: 100%;
}
</style>
