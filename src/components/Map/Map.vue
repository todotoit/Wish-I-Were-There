<template>
  <div class="map-container">
    <div id="map" ref="map"></div>
  </div>
</template>

<script>
import styles from "./map-styles.js";
import { createBubble } from "./overlay";

export default {
  name: "Map",
  props: {
    apiKey: {
      type: String,
      required: true
    }
  },
  mounted() {
    if (document.getElementsByClassName("gm-src").length) return;
    let script = document.createElement("script");
    script.classList.add("gm-src");
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
      this.map = new google.maps.Map(this.$refs.map, {
        center: { lat: 45.060285, lng: 7.680763 },
        zoom: 15,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
        styles: styles["todo"]
      });
      this.createBubbles();
    },
    createCircle() {
      const circle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: this.map,
        center: { lat: 45.060285, lng: 7.680763 },
        radius: 200
      });
    },
    createBubbles() {
      const marker = new google.maps.Marker({
        position: { lat: 45.060285, lng: 7.680763 },
        map: this.map
      });
      const overlay = createBubble(this.map, {
        x: 45.060285,
        y: 7.680763
      });
    }
  }
};
</script>

<style scoped lang="scss">
.map-container,
#map {
  height: 100%;
}
</style>
