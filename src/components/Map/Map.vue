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
  data() {
    return {
      pos: {
        lat: 45.060285,
        lng: 7.680763
      }
    };
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
        center: { lat: this.pos.lat, lng: this.pos.lng },
        zoom: 15,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
        styles: styles["todo"]
      });
      this.createBubbles();
    },
    createBubbles() {
      const marker = new google.maps.Marker({
        position: { lat: this.pos.lat, lng: this.pos.lng },
        map: this.map
      });
      const infowindow = new google.maps.InfoWindow({
        content: `We envision, design and deliver unexpected experiences, so that people can live valuable, transformative moments`,
        maxWidth: 200
      });
      marker.addListener("click", function() {
        infowindow.open(this.map, marker);
      });
      const overlay = createBubble(this.map, {
        x: this.pos.lat,
        y: this.pos.lng
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
