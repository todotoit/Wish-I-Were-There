<template>
  <div class="map-container">
    <input ref="search-location" type="text" id="search-location" placeholder="Search by location" />
    <div id="map" ref="map"></div>
  </div>
</template>

<script>
import styles from "./map-styles.js";
import { createBubble } from "./overlay";
import { getNewItems, getRemovedItems } from "@/utils";

export default {
  name: "Map",
  props: {
    apiKey: {
      type: String,
      required: true
    }
  },
  watch: {
    users(val, oldVal) {
      if (!this.ready) return;
      const newUsers = getNewItems(val, oldVal);
      newUsers.forEach(user => this.createUserBubble(user));
    },
    pins(val, oldVal) {
      if (!this.ready) return;
      const newPins = getNewItems(val, oldVal);
      newPins.forEach(pin => this.createPin(pin));
    }
  },
  computed: {
    users() {
      return this.$store.state.users.slice();
    },
    pins() {
      return this.$store.state.pins.slice();
    }
  },
  data() {
    return {
      ready: false,
      startPos: {
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
    document.head.appendChild(script);
  },
  methods: {
    init() {
      this.map = new google.maps.Map(this.$refs.map, {
        center: { lat: this.startPos.lat, lng: this.startPos.lng },
        zoom: 15,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
        zoomControl: true,
        styles: styles["mappette"]
      });
      this.setupSearch(this.map);
      this.ready = true
    },
    createUserBubble(user) {
      const coordinates = user.coordinates;
      const marker = new google.maps.Marker({
        position: { lat: coordinates.Wa, lng: coordinates.za },
        map: this.map
      });
      const overlay = createBubble(this.map, {
        lat: coordinates.Wa,
        lng: coordinates.za
      });
      user.marker = marker;
    },
    createPin(pin) {
      const coordinates = pin.coordinates;
      const marker = new google.maps.Marker({
        position: { lat: coordinates.Wa, lng: coordinates.za },
        map: this.map
      });
      const infowindow = new google.maps.InfoWindow({
        content: pin.message,
        maxWidth: 200
      });
    },
    setupSearch() {
      const input = this.$refs["search-location"];
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo("bounds", this.map);

      autocomplete.setFields([
        "address_components",
        "geometry",
        "icon",
        "name"
      ]);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place || !place.geometry) {
          return;
        }
        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        } else {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(17);
        }
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
#search-location {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 20;
  width: 20%;
  height: 20px;
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
