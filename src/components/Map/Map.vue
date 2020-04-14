<template>
  <div class="map-container" :class="{active: isExplore, placing: placing}">
    <SearchLocation id="search-location" v-if="map && isExplore" />
    <div class="tools" v-if="map && isExplore">
      <h4>Visualizing</h4>
      <ul>
        <li :class="{active: showUserBubbles}" @click="showUserBubbles = !showUserBubbles">
          <img src="@/assets/icons/bubble-small.svg" svg-inline class="toggle-icon" /> Microcosms
        </li>
        <li :class="{active: showPins}" @click="showPins = !showPins">
          <img src="@/assets/icons/pin-small.svg" svg-inline class="toggle-icon" /> Daydreams
        </li>
      </ul>
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
    selectedUserMarker(val) {
      this.userMarkers.forEach(m => {
        m.setOpacity(val ? 0.3 : 1);
        m.overlay.setDisabled(val);
      });
      if (val) {
        val.setOpacity(1);
        val.overlay.setDisabled(false);
      }
    },
    selectedPinMarker(val) {
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
      selectedUserMarker: null,
      selectedPinMarker: null
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
      this.selectedUserMarker = null;
      this.selectedPinMarker = null;
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
      marker.addListener("click", e => {
        if (e) e.stop();
        this.highlightUser(marker);
      });
      marker.user = user;
      marker.overlay = overlay;
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
        this.highlightPin(marker);
      });
      marker.infoWindow = infoWindow;
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
    highlightUser(userMarker) {
      this.selectedUserMarker = userMarker;
      const pin = this.$store.getters.getUserPin(userMarker.user.id);
      if (!pin) return this.zoomOnCoords(userMarker.position);
      const pinMarker = this.getPinMarker(pin.id);
      const pinCoords = pinMarker.getPosition();
      const userCoords = userMarker.getPosition();
      this.createLink(pinCoords, userCoords);
      this.selectedPinMarker = pinMarker;
      this.showPinMessage(pinMarker);
    },
    highlightPin(pinMarker) {
      const userMarker = this.getUserMarker(pinMarker.pin.user.id);
      this.selectedUserMarker = userMarker;
      this.selectedPinMarker = pinMarker;
      const pinCoords = pinMarker.getPosition();
      const userCoords = userMarker.getPosition();
      this.createLink(pinCoords, userCoords);
      this.showPinMessage(pinMarker);
    },
    createInfoWindow(pin) {
      let user = pin.user;
      // let content = `<h4>${user.name || "anonymous"}</h4>`;
      let content = `<p>${pin.message}</p>`;
      return new google.maps.InfoWindow({
        content,
        maxWidth: 300
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
    getUserMarker(id) {
      return this.userMarkers.find(marker => marker.user.id === id);
    },
    getPinMarker(id) {
      return this.pinMarkers.find(marker => marker.pin.id === id);
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
  top: 1rem;
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
  z-index: 20;

  h4 {
    color: $col-green;
    text-transform: uppercase;
    font-family: "GT America Expanded";
    padding-bottom: 1rem;
    border-bottom: 1px solid $col-white;
  }
  ul,
  li {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  li {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    opacity: 0.5;
    cursor: pointer;
    &.active {
      opacity: 1;
    }
    svg {
      margin-right: 0.5rem;
    }
  }
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
    top: 48%;
    left: 56%;
    z-index: 20;
    user-select: none;
    color: $col-green;
    @extend .medium;
    &::before {
      content: '.'
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
