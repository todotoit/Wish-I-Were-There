<template>
  <div class="marker-placer">
    <SearchLocation @change="centerMarker()" :placeholder="placeholder" />
  </div>
</template>

<script>
import SearchLocation from "@/components/SearchLocation";

export default {
  name: "MarkerPlacer",
  components: { SearchLocation },
  props: {
    type: {
      type: String,
      default: "bubble"
    },
    geolocation: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      required: true,
      default: ""
    }
  },
  computed: {
    map() {
      return this.$store.state.map;
    },
    marker() {
      return this.$store.state.marker;
    }
  },
  mounted() {
    let url;
    if (this.type === "bubble") url = require("@/assets/icons/bubble.svg");
    else url = require("@/assets/icons/pin.svg");
    const img = {
      url,
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12.5, 12.5),
      scaledSize: new google.maps.Size(30, 30)
    };
    const marker = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map,
      draggable: true,
      icon: img
    });
    this.$store.commit("SET_MARKER", marker);
    google.maps.event.addListener(this.map, "click", event => {
      this.updateMarker(event.latLng);
    });
    if (this.geolocation) this.locateUser();
  },
  destroyed() {
    google.maps.event.clearListeners(this.map, "click");
    this.marker.setMap(null);
  },
  methods: {
    centerMarker() {
      this.marker.setPosition(this.map.getCenter());
    },
    updateMarker(pos) {
      this.marker.setPosition(pos);
    },
    locateUser() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.map.setCenter(pos);
            this.updateMarker(pos);
            this.map.setZoom(17);
          },
          () => {
            console.log("geolocation not available");
          }
        );
      } else {
        console.log("geolocation not available");
      }
    }
  }
};
</script>

<style>
</style>
