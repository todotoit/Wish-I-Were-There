<template>
  <input ref="search-location" type="text" class="search-input" :placeholder="placeholder" />
</template>

<script>
export default {
  name: "SearchLocation",
  props: {
    placeholder: {
      type: String,
      required: true,
      default: ""
    }
  },
  computed: {
    map() {
      return this.$store.state.map;
    }
  },
  mounted() {
    const input = this.$el;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(["address_components", "geometry", "name"]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place || !place.geometry) return;
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }
      this.$emit("change");
    });
  }
};
</script>

<style lang="scss">
@media screen and (max-width: $mqMobile) {
  input[type="text"].search-input {
    margin-top: .5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-size: 1.05rem;
  }
}
.pac-container {
  border-top: none;
  background-color: rgba($col-dark, 0.9);
  .pac-item:first-child {
    border-top: none;
  }
  .pac-item {
    &:hover {
      background-color: $col-green;
      color: $col-white;
      .pac-item-query {
        color: $col-white;
      }
    }
    font-family: "GT America Extended", Arial, Helvetica, sans-serif;
    font-size: 1.1rem;
    line-height: 120%;
    @media screen and (max-width: $mqTablet) {
      font-size: 1.05rem;
    }
    @media screen and (max-width: $mqSmallMobile) {
      font-size: 1rem;
      line-height: 120%;
    }
    font-size: 0.6rem;
  }
  .pac-item-query {
    font-size: 0.8rem;
    line-height: 200%;
    color: $col-green;
  }
}
</style>
