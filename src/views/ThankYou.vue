<template>
  <div class="view-content">
    <header>
      <h2 class="expa-large">{{$t('phase05Title')}}</h2>
      <p class="exte-medium" v-html="kmDistance"></p>
      <Share />
    </header>
    <footer>
      <button @click="next">{{$t('phase05Btn')}}</button>
    </footer>
  </div>
</template>

<script>
import Share from "@/components/Share.vue";
import Events from "@/plugins/events";

export default {
  name: "ThankYou",
  components: { Share },
  data() {
    return {
      distance: 0
    };
  },
  computed: {
    map() {
      return this.$store.state.map;
    },
    user() {
      return this.$store.state.user;
    },
    pin() {
      return this.$store.state.userPins;
    },
    kmDistance() {
      return this.$t("phase05Desc", {
        distance: (this.distance / 1000).toFixed(2)
      });
    }
  },
  mounted() {
    Events.$emit("select-user", this.user.id);
    const spherical = google.maps.geometry.spherical;
    this.distance = spherical.computeDistanceBetween(
      this.user.marker.getPosition(),
      this.pin.marker.getPosition()
    );
    if (isNaN(this.distance)) this.distance = 0;
  },
  methods: {
    next() {
      this.$router.push("/explore");
      this.map.setZoom(12);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep p .distance {
  color: $col-green;
}
</style>
