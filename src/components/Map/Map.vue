<template>
  <div class="map-container" :class="{active: isExplore}">
    <SearchLocation id="search-location" v-if="ready && isExplore" />
    <div id="map" ref="map"></div>
  </div>
</template>

<script>
import styles from "./map-styles.js";
import { createBubble } from "./overlay";
import { getNewItems, getRemovedItems } from "@/utils";
import SearchLocation from "@/components/SearchLocation.vue";

export default {
  name: "Map",
  components: { SearchLocation },
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
    },
    ready() {
      return this.$store.state.ready;
    },
    isExplore() {
      return this.$route.path === "/explore";
    }
  },
  data() {
    return {
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
      this.$store.commit("SET_MAP", this.map);
      this.$store.commit("SET_READY", true);
      console.log(this.map);
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
    }
  }
};
</script>

<style lang="scss">
.map-container,
#map {
  height: 100%;
  background-color: #212121;
}
#search-location {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 20;
}
#map > div {
    background-color: #212121!important;
}
.map-container:not(.active) .gm-style > div:first-child > div:first-child > div:last-child {
  opacity: 0.2;
}
</style>
