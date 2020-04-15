<template>
  <div class="info">
    <div class="header">
      <p class="expa-large">Done, Thanks!</p>
      <p
        class="exte-medium"
      >Your message has been sent! Your daydream is now travelling 2,5 km away from your current galaxy</p>
    </div>
    <div class="footer">
      <button @click="$router.push('/explore')">Explore the map</button>
    </div>
  </div>
</template>

<script>
import Share from "@/components/Share.vue";
import Events from "@/events";

export default {
  name: "FindYourBubble",
  components: { Share },
  computed: {
    map() {
      return this.$store.state.map;
    },
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    Events.$emit("select-user", this.user.id);
  }
};
</script>

<style lang="scss" scoped>
</style>
