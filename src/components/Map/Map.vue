<template>
  <div class="map-container" :class="{active: isExplore, placing: placing}">
    <SearchLocation id="search-location" v-if="map && isExplore" />
    <div id="map" ref="map"></div>
  </div>
</template>

<script>
import styles from "./map-styles.js";
import { createBubble } from "./bubble/bubble-overlay";
import { getNewItems, getRemovedItems } from "@/utils";
import SearchLocation from "@/components/SearchLocation.vue";
import GmapsQuadraticBezier from "./line/gm-bezier";

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
    },
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      startPos: {
        lat: 45.060285,
        lng: 7.680763
      },
      bubbleMarkers: [],
      line: null,
      infoWindow: null
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
    google.maps.event.addListener(map, "click", e => {
      if (this.line) this.line.remove();
      if (this.infoWindow) this.infoWindow.close();
    });
    this.pins.forEach(p => this.createPin(p));
    this.users.forEach(u => this.createUserBubble(u));
    if (this.user) this.zoomOnCoords(this.getLatLng(this.user.coordinates));
  },
  methods: {
    createUserBubble(user) {
      const pos = { lat: user.coordinates.Wa, lng: user.coordinates.za };
      const img = {
        url: require("@/assets/icons/bubble.svg"),
        size: new google.maps.Size(10, 10),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(5, 5)
      };
      const marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        icon: img
      });
      const overlay = createBubble(this.map, pos, user);
      user.marker = marker;
      marker.addListener("click", () => {
        this.highlightUser(user);
      });
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
      const infoWindow = this.createInfoWindow(pin);
      marker.addListener("click", () => {
        if (this.infoWindow) this.infoWindow.close();
        infoWindow.open(this.map, marker);
        this.infoWindow = infoWindow;
        this.highlightPin(pin);
      });
    },
    createLink(start, end) {
      if (this.line) this.line.remove();
      const spherical = google.maps.geometry.spherical;
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(end);
      bounds.extend(start);
      const center = bounds.getCenter();
      const dist = spherical.computeDistanceBetween(start, end);
      const angle = spherical.computeHeading(start, end);
      const offset = spherical.computeOffset(center, dist / 2, angle + 60);
      this.line = new GmapsQuadraticBezier(start, offset, end, {}, this.map);
      this.line.draw();
      this.map.fitBounds(bounds);
    },
    highlightUser(user) {
      const pin = this.$store.getters.getUserPin(user.id);
      if (!pin) return this.zoomOnCoords(user.marker);
      const pinCoords = this.getLatLng(pin.coordinates);
      const userCoords = user.marker.getPosition();
      this.createLink(pinCoords, userCoords);
    },
    highlightPin(pin) {
      const pinCoords = this.getLatLng(pin.coordinates);
      const userCoords = this.getLatLng(pin.user.coordinates);
      this.createLink(pinCoords, userCoords);
    },
    createInfoWindow(pin) {
      let user = pin.user;
      if (typeof pin.user === "string")
        user = this.$store.getters.getUserByRef(pin.user);
      let content = `<h4>${user.name || 'anonymous'}</h4>`;
      content += `<p>${pin.message}</p>`;
      return new google.maps.InfoWindow({
        content
      });
    },
    zoomOnCoords(coords) {
      this.map.setCenter(coords);
      this.map.setZoom(17);
    },
    getLatLng(coordinates) {
      return new google.maps.LatLng({
        lat: coordinates.latitude,
        lng: coordinates.longitude
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
    &.far {
      animation: spin 54s linear infinite;
    }
    opacity: 0.5;
    &.hidden {
      opacity: 0;
      animation: none;
    }
  }
  label {
    position: absolute;
    top: 50%;
    left: 60%;
    z-index: 20;
    user-select: none;
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
