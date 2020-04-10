<template>
  <div class="map-container" :class="{active: isExplore, placing: placing}">
    <SearchLocation id="search-location" v-if="map && isExplore" />
    <div class="tools" v-if="map && isExplore">
      <p>
        <input type="checkbox" v-model="showUserBubbles" />Show bubbles
      </p>
      <p>
        <input type="checkbox" v-model="showPins" />Show pins
      </p>
    </div>
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
    },
    showUserBubbles(val) {
      this.userMarkers.forEach(m => {
        m.setVisible(val);
        m.overlay.setVisible(val);
      });
    },
    showPins(val) {
      this.pinMarkers.forEach(m => m.setVisible(val));
    },
    selectedUser(val) {
      this.userMarkers.forEach(m => {
        m.setOpacity(val ? 0.3 : 1);
        m.overlay.setDisabled(val);
      });
      if (val) {
        val.setOpacity(1);
        val.overlay.setDisabled(false);
      }
    },
    selectedPin(val) {
      this.pinMarkers.forEach(m => m.setOpacity(val ? 0.3 : 1));
      if (val) val.setOpacity(1);
    },
    $route(to, from) {
      if (to.path === "/explore" && !this.init) this.createItems();
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
      userMarkers: [],
      pinMarkers: [],
      showUserBubbles: true,
      showPins: true,
      line: null,
      infoWindow: null,
      init: false,
      selectedUser: null,
      selectedPin: null
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
      this.selectedUser = null;
      this.selectedPin = null;
    });
    if (this.user) this.zoomOnCoords(this.getLatLng(this.user.coordinates));
    if (this.isExplore && !this.init) this.createItems();
  },
  methods: {
    createItems() {
      this.pins.forEach(p => this.createPin(p));
      this.users.forEach(u => this.createUserBubble(u));
      this.init = true;
    },
    createUserBubble(user) {
      const pos = { lat: user.coordinates.Wa, lng: user.coordinates.za };
      const img = {
        url: require("@/assets/icons/bubble.svg"),
        scaledSize: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 10)
      };
      const marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        icon: img,
        visible: this.showUserBubbles
      });
      const overlay = createBubble(this.map, pos, user, this.showUserBubbles);
      user.marker = marker;
      marker.user = user;
      marker.addListener("click", e => {
        console.log("mark");
        if (e) e.stop();
        this.highlightUser(user);
      });
      marker.overlay = overlay;
      overlay.marker = marker;
      this.userMarkers.push(marker);
    },
    createPin(pin) {
      if (typeof pin.user === "string") {
        pin.user = this.$store.getters.getUserByRef(pin.user);
      }
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
        icon: img,
        visible: this.showUserBubbles
      });
      const infoWindow = this.createInfoWindow(pin);
      marker.addListener("click", () => {
        this.highlightPin(pin);
      });
      marker.infoWindow = infoWindow
      marker.pin = pin;
      this.pinMarkers.push(marker);
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
      this.selectedUser = user.marker;
      const pinMarker = this.pinMarkers.find(
        marker => marker.pin.user.id === user.id
      );
      if (!pinMarker) return this.zoomOnCoords(user.marker.position);
      const pinCoords = pinMarker.getPosition();
      const userCoords = user.marker.getPosition();
      this.createLink(pinCoords, userCoords);
      this.selectedPin = pinMarker;
      this.showPinMessage(pinMarker)
    },
    highlightPin(pin) {
      const userMarker = this.userMarkers.find(
        marker => marker.user.id === pin.user.id
      );
      const pinMarker = this.pinMarkers.find(
        marker => marker.pin.id === pin.id
      );
      this.selectedUser = userMarker;
      this.selectedPin = pinMarker;
      const pinCoords = this.getLatLng(pin.coordinates);
      const userCoords = this.getLatLng(pin.user.coordinates);
      this.createLink(pinCoords, userCoords);
      this.showPinMessage(pinMarker)
    },
    createInfoWindow(pin) {
      let user = pin.user;
      let content = `<h4>${user.name || "anonymous"}</h4>`;
      content += `<p>${pin.message}</p>`;
      return new google.maps.InfoWindow({
        content
      });
    },
    showPinMessage(marker) {
      if (this.infoWindow) this.infoWindow.close();
      marker.infoWindow.open(this.map, marker);
      this.infoWindow = marker.infoWindow;
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
.tools {
  position: absolute;
  left: 1rem;
  top: 1rem;
  z-index: 100;
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
  z-index: -3000;
  pointer-events: auto;
  &.hidden,
  &.far {
    pointer-events: none;
    opacity: 0;
  }
  &.disabled {
    opacity: 0.25;
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
      pointer-events: none;
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
