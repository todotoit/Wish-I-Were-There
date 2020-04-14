<template>
  <div class="info">
    <div class="header">
      <p class="large">Done, Thanks!</p>
      <p
        class="medium"
      >Your message has been sent! Your daydream is now travelling 2,5 km away from your current galaxy</p>
    </div>
    <div class="footer">
      <button @click="$router.push('/explore')">Explore the map</button>
    </div>
  </div>
</template>

<script>
import Share from "@/components/Share.vue";

export default {
  name: "FindYourBubble",
  components: { Share }
};
</script>

<style lang="scss" scoped>

</style>
