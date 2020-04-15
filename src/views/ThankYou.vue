<template>
  <div class="info">
    <div class="header">
      <p class="expa-large">{{$t('phase05Title')}}</p>
      <p class="exte-medium" v-html="kmDistance"></p>
      <Share />
    </div>
    <div class="footer">
      <button @click="$router.push('/explore')">{{$t('phase05Btn')}}</button>
    </div>
  </div>
</template>

<script>
import Share from "@/components/Share.vue";
import Events from "@/events";

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
      return $t("phase05Desc", { distance: (distance / 1000).toFixed(2) });
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
  }
};
</script>

<style lang="scss" scoped>
p /deep/ span {
  color: $col-green;
}
</style>
