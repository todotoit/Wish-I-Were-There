<template>
  <div class="info">
    <div class="header">
      <p class="expa-large">{{$t('phase05Title')}}</p>
      <p class="exte-medium">{{$('phase05Desc', {distance: 15})}}</p>
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
