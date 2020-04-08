<template>
  <div class="map-container">
    <div id="map" ref="map"></div>
    <input id="find_place" type="text" placeholder="Search by location" />
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
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
      this.searchLocation(this.map);
    },
    searchLocation(map) {
      const input = document.getElementById("find_place");
      const autocomplete = new google.maps.places.Autocomplete(input);

      // Bind the map's bounds (viewport) property to the autocomplete object,
      // so that the autocomplete requests use the current map bounds for the
      // bounds option in the request.
      autocomplete.bindTo("bounds", map);

      // Set the data fields to return when the user selects a place.
      autocomplete.setFields([
        "address_components",
        "geometry",
        "icon",
        "name"
      ]);

      autocomplete.addListener("place_changed", function() {
        var place = autocomplete.getPlace();
        console.log(place)
        if (!place.geometry) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17); // Why 17? Because it looks good.
        }
      });
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
#find_place {
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
