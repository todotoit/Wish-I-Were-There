<template>
  <div class="map-container" :class="{active: isExplore, placing: placing}">
    <SearchLocation id="search-location" v-if="map && isExplore" />
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
  watch: {
    users(val, oldVal) {
      const newUsers = getNewItems(val, oldVal);
      newUsers.forEach(user => this.createUserBubble(user));
    },
    pins(val, oldVal) {
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
    isExplore() {
      return this.$route.path === "/explore";
    },
    map() {
      return this.$store.state.map;
    },
    placing() {
      return this.$store.state.placing;
    }
  },
  data() {
    return {
      startPos: {
        lat: 45.060285,
        lng: 7.680763
      },
      bubbleMarkers: []
    };
  },
  mounted() {
    const map = new google.maps.Map(this.$refs.map, {
      center: { lat: this.startPos.lat, lng: this.startPos.lng },
      zoom: 15,
      minZoom: 3,
      maxZoom: 18,
      mapTypeId: "roadmap",
      disableDefaultUI: true,
      zoomControl: true,
      styles: styles["mappette"],
      clickableIcons: false
    });
    this.$store.commit("SET_MAP", map);
    google.maps.event.addListener(map, "zoom_changed", e =>
      this.handleMapZoom(e)
    );
  },
  methods: {
    createUserBubble(user) {
      const coordinates = user.coordinates;
      const img = {
        url: require("@/assets/icons/bubble.svg"),
        size: new google.maps.Size(10, 10),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(5, 5)
      };
      const marker = new google.maps.Marker({
        position: { lat: coordinates.Wa, lng: coordinates.za },
        map: this.map,
        icon: img
      });
      const overlay = createBubble(this.map, {
        lat: coordinates.Wa,
        lng: coordinates.za
      });
      user.marker = marker;
      this.bubbleMarkers.push(marker);
    },
    createPin(pin) {
      const coordinates = pin.coordinates;
      const img = {
        url: require("@/assets/icons/pin.svg"),
        size: new google.maps.Size(25, 25),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12.5, 12.5)
      };
      const marker = new google.maps.Marker({
        position: { lat: coordinates.Wa, lng: coordinates.za },
        map: this.map,
        icon: img
      });
      const infowindow = new google.maps.InfoWindow({
        content: pin.message,
        maxWidth: 200
      });
    },
    handleMapZoom(e) {
      const zoom = this.map.getZoom();
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
  background-color: #212121 !important;
}
.map-container:not(.active)
  .gm-style
  > div:first-child
  > div:first-child
  > div:last-child {
  opacity: 0.2;
}
.bubble-container {
  position: absolute;
  transition: opacity 0.3s;
  &.hidden {
    opacity: 0;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity 0.5s;
    animation: spin 54s linear infinite;
    opacity: .5;
    &.hidden {
      opacity: 0;
    }
  }
}

.bubble {
  display: block;
}

.placing .bubble {
  opacity: 0.3;
}

.bubble-area {
  fill: rgba(255, 255, 255, 0.2);
}
.bubble-dot {
  fill: rgba(255, 255, 255, 0.5);
}
</style>
