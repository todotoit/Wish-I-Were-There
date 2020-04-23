<template>
  <div class="map-container" :class="{active: isExplore, placing: placing, highlight}">
    <div class="view">
      <div class="view-content">
        <header>
          <Tools
            v-if="map && isExplore"
            :show-user-markers="showUserMarkers"
            :show-pin-markers="showPinMarkers"
            @toggle-users="showUserMarkers = !showUserMarkers"
            @toggle-pins="showPinMarkers = !showPinMarkers"
          />
          <SearchLocation
            id="search-location"
            v-if="map && isExplore"
            :placeholder="$t('exploreSearch')"
          />
        </header>
        <footer>
          <button
            v-if="!user && isExplore"
            class="add-your-star"
            @click="$router.push('/bubble')"
          >{{ $t('exploreAddYours') }}</button>
        </footer>
      </div>
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
import Tools from "./Tools";
import Events from "@/plugins/events";
import MarkerClusterer from "@google/markerclustererplus";

const CLUSTER_GRID_SIZE = 40;

export default {
  name: "Map",
  components: { SearchLocation, Tools },
  watch: {
    users(val, oldVal) {
      const newUsers = getNewItems(val, oldVal);
      newUsers.forEach(user => this.createUserBubble(user));
    },
    pins(val, oldVal) {
      const newPins = getNewItems(val, oldVal);
      newPins.forEach(pin => this.createPin(pin));
    },
    showUserMarkers(val) {
      this.toggleUserMarkers(val);
    },
    showPinMarkers(val) {
      this.togglePinMarkers(val);
    },
    selectedUserMarker(val) {
      this.userMarkers.forEach(m => {
        m.setOpacity(val ? 0.3 : 1);
        m.overlay.setDisabled(val);
      });
      this.pinMarkers.forEach(m => m.setOpacity(val ? 0.3 : 1));
      if (val) {
        val.setOpacity(1);
        val.overlay.setDisabled(false);
      }
      this.map.selectedUserMarker = val;
      this.highlight = !!val;
      this.toggleClustering(this.highlight);
    },
    selectedPinMarker(val) {
      if (val) val.setOpacity(1);
    },
    $route(to, from) {
      if (to.meta.explore && !this.init) this.createItems();
      if (from.meta.tutorial && to.meta.explore) {
        this.toggleUserMarkers(true);
        this.togglePinMarkers(true);
        this.toggleClustering(true)
      }
      if (!from.meta.tutorial && to.meta.tutorial) {
        this.toggleUserMarkers(false);
        this.togglePinMarkers(false);
        this.toggleClustering(false)
      }
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
      return this.$route.meta.explore;
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
      showUserMarkers: true,
      showPinMarkers: true,
      line: null,
      infoWindow: null,
      init: false,
      selectedUserMarker: null,
      selectedPinMarker: null,
      highlight: false
    };
  },
  mounted() {
    const map = new google.maps.Map(this.$refs.map, {
      center: { lat: this.startPos.lat, lng: this.startPos.lng },
      zoom: 13,
      minZoom: 3,
      maxZoom: 19,
      mapTypeId: "roadmap",
      disableDefaultUI: true,
      zoomControl: true,
      styles: styles["daydream"],
      clickableIcons: false
    });
    this.oms = new OverlappingMarkerSpiderfier(map, {
      markersWontMove: true,
      markersWontHide: true,
      basicFormatEvents: true,
      nearbyDistance: 30,
      circleFootSeparation: 50
    });
    const mti = google.maps.MapTypeId;
    this.oms.legColors.highlighted[mti.ROADMAP] = "#02E19F";
    this.$store.commit("SET_MAP", map);
    this.createUserCluster();
    this.createPinCluster();
    this.map.showUserMarkers = this.showUserMarkers;
    this.map.showPinMarkers = this.showPinMarkers;
    google.maps.event.addListener(map, "click", e => this.deselect(e));
    google.maps.event.addListener(map, "touch", e => this.deselect(e));
    if (this.isExplore && !this.init) this.createItems();
    Events.$on("select-user", id => {
      const marker = this.getUserMarker(id);
      if (marker) this.highlightUser(marker, false);
    });
  },
  methods: {
    createItems() {
      this.pins.forEach(p => this.createPin(p));
      this.users.forEach(u => this.createUserBubble(u));
      this.init = true;
      this.checkHighlight();
    },
    removeItems() {
      this.userMarkers.forEach(u => {
        u.setVisible(false);
        u.overlay.setMap(null);
      });
      this.pinMarkers.forEach(p => p.setVisible(false));
      this.userMarkers = [];
      this.pinMarkers = [];
      this.init = false;
    },
    checkHighlight() {
      let user = this.user;
      if (this.isExplore && this.$route.params.id) {
        user = this.$store.getters.getUser(this.$route.params.id);
      }
      if (user) {
        const marker = this.getUserMarker(user.id);
        if (marker) this.highlightUser(marker);
      }
    },
    createUserCluster() {
      this.userCluster = new MarkerClusterer(this.map, this.userMarkers, {
        styles: null,
        maxZoom: 13,
        gridSize: CLUSTER_GRID_SIZE,
        clusterClass: "map-cluster",
        imageExtension: "svg",
        ignoreHidden: true
      });
    },
    createPinCluster() {
      this.pinCluster = new MarkerClusterer(this.map, this.pinMarkers, {
        styles: null,
        maxZoom: 13,
        gridSize: CLUSTER_GRID_SIZE,
        imagePath: "../images/s",
        clusterClass: "map-cluster",
        imageExtension: "svg",
        ignoreHidden: true
      });
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
        icon: img,
        visible: this.showUserMarkers
      });
      this.map.markerOptions = {
        visible: this.showUserMarkers,
        disabled: this.selectedUserMarker
      };
      const overlay = createBubble(this.map, pos, { user, marker });
      marker.addListener("spider_format", e => {
        marker.overlay.update();
      });
      marker.addListener("spider_click", e => {
        if (e) e.stop();
        this.highlightUser(marker);
      });
      marker.user = user;
      marker.overlay = overlay;
      this.userCluster.addMarker(marker);
      this.oms.addMarker(marker);
      this.userMarkers.push(marker);
    },
    createPin(pin) {
      if (typeof pin.user === "string") {
        pin.user = this.$store.getters.getUserByRef(pin.user);
      }
      const coordinates = pin.coordinates;
      const img = {
        url: require("@/assets/icons/pin.svg"),
        size: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17.5, 17.5)
      };
      const marker = new google.maps.Marker({
        position: { lat: coordinates.Wa, lng: coordinates.za },
        icon: img,
        visible: this.showUserMarkers
      });
      const infoWindow = this.createInfoWindow(pin);
      marker.addListener("spider_click", () => {
        this.highlightPin(marker);
      });
      marker.infoWindow = infoWindow;
      marker.pin = pin;
      this.pinCluster.addMarker(marker);
      this.oms.addMarker(marker);
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
      const offset = spherical.computeOffset(center, dist / 2, angle + 75);
      this.line = new GmapsQuadraticBezier(start, offset, end, {}, this.map);
      this.line.draw();
      this.map.fitBounds(bounds);
    },
    highlightUser(userMarker, showMessage = true) {
      this.deselect();
      this.selectedUserMarker = userMarker;
      userMarker.setVisible(true);
      userMarker.overlay.setDisabled(false);
      userMarker.overlay.setVisible(true);
      userMarker.overlay.forceVisible(true);
      const pin = this.$store.getters.getUserPin(userMarker.user.id);
      if (!pin) return this.zoomOnCoords(userMarker.position);
      const pinMarker = this.getPinMarker(pin.id);
      pinMarker.setVisible(true);
      const pinCoords = pinMarker.getPosition();
      const userCoords = userMarker.getPosition();
      this.createLink(pinCoords, userCoords);
      this.selectedPinMarker = pinMarker;
      if (showMessage) this.showPinMessage(pinMarker);
    },
    highlightPin(pinMarker) {
      this.deselect();
      const userMarker = this.getUserMarker(pinMarker.pin.user.id);
      userMarker.overlay.forceVisible(true);
      this.selectedUserMarker = userMarker;
      this.selectedPinMarker = pinMarker;
      const pinCoords = pinMarker.getPosition();
      const userCoords = userMarker.getPosition();
      this.createLink(pinCoords, userCoords);
      this.showPinMessage(pinMarker);
    },
    createInfoWindow(pin) {
      let user = pin.user;
      let message = pin.message || "No message.";
      let content = `<p class="exte-small">${message}</p>`;
      const shareMessage = this.$t("shareMessage", {
        url: this.$store.getters.getUserUrl(user.id),
        msg: message
      });
      content += `<p class="share-url thin-medium"><button onclick="this.nextSibling.select(); document.execCommand('copy'); var t = this.nextSibling.nextSibling; t.innerText='copied'; setTimeout(function () {t.innerText = ''}, 2000)">Share</button><input type="text" readonly value="${shareMessage}" /><span></span></p>`;
      const info = new google.maps.InfoWindow({
        content,
        maxWidth: 500
      });
      return info;
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
    deselect(e) {
      if (this.line) this.line.remove();
      if (this.infoWindow) this.infoWindow.close();
      if (this.selectedUserMarker)
        this.selectedUserMarker.overlay.forceVisible(false);

      this.selectedUserMarker = null;
      this.selectedPinMarker = null;
    },
    toggleUserMarkers(val) {
      this.showUserMarkers = val;
      this.userMarkers.forEach(m => {
        m.setVisible(val);
        m.overlay.setVisible(val);
      });
    },
    togglePinMarkers(val) {
      this.showPinMarkers = val;
      this.pinMarkers.forEach(m => m.setVisible(val));
    },
    toggleClustering(disable) {
      this.userCluster.setMaxZoom(disable ? 1 : 13);
      this.userCluster.setGridSize(disable ? 1 : CLUSTER_GRID_SIZE);
      this.userCluster.repaint();
      this.pinCluster.setMaxZoom(disable ? 1 : 13);
      this.pinCluster.setGridSize(disable ? 1 : CLUSTER_GRID_SIZE);
      this.pinCluster.repaint();
    }
  }
};
</script>

<style lang="scss">
.map-container,
#map {
  height: 100%;
  background-color: $col-dark;
}
#map > div {
  background-color: $col-dark !important;
}
#search-location {
  width: 100%;
}
@media screen and (min-width: $mqTablet) {
  .map-container .view .view-content {
    header {
      width: 100%;
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      &::after {
        content: " ";
        display: block;
      }
      .tools {
        flex: 1;
        max-width: 25%;
        .tools-wrap {
          padding: 0;
        }
      }
      #search-location {
        width: 26rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
.bubble-container {
  position: absolute;
  transition: opacity 0.3s;
  z-index: -3000;
  pointer-events: auto;
  &.disabled {
    opacity: 0.25;
  }
  &.hidden,
  &.far {
    opacity: 0;
    &.force-visible {
      opacity: 1;
    }
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
      animation: spin 80s linear infinite;
    }
    opacity: 0.3;
    &.hidden {
      opacity: 0;
      animation: none;
      pointer-events: none;
    }
  }
}
label.bubble-label {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
  user-select: none;
  color: $col-green;
  font-size: 1rem;
  white-space: nowrap;
  display: block;
  padding-left: 0.25rem;
  &::before {
    content: ".";
  }
  &.disabled {
    opacity: 0.25;
  }
  &.hidden,
  &.far {
    opacity: 0;
    &.force-visible {
      opacity: 1;
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

.map-cluster > div > span {
  font-family: "GT America Light", Arial, Helvetica, sans-serif;
  font-size: 1rem;
  display: block;
  transform: translateY(-15%);
  color: $col-green;
}
</style>
