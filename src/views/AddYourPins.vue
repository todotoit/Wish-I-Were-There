<template>
  <div class="info">
    <template v-if="!addingMessage">
      <div class="header">
        <p class="expa-large">{{ $t('phase03Title') }}</p>
        <p class="exte-medium">{{ $t('phase03Desc') }}</p>
        <MarkerPlacer type="pin" :placeholder="$t('phase03Input')" />
      </div>
      <div class="footer">
        <button @click="addingMessage = true">{{ $t('phase03Btn') }}</button>
        <p class="exte-small link" @click="$router.push('/explore')">{{ $t('phase03Skip') }}</p>
      </div>
    </template>
    <template v-else>
      <div class="header">
        <p class="expa-large">{{ $t('phase04Title') }}</p>
        <p class="exte-medium">{{ $t('phase04Desc') }}</p>
        <InputCheck v-slot="{validate}" @validate="valid = $event" :empty="false">
          <textarea :placeholder="$t('phase04Input')" v-model="message" @input="validate"></textarea>
        </InputCheck>
      </div>
      <div class="footer">
        <button @click="createNewPin" :disabled="!message">{{ $t('phase04Btn') }}</button>
      </div>
    </template>
  </div>
</template>

<script>
import MarkerPlacer from "@/components/MarkerPlacer.vue";
import { cleanInput } from "@/utils";

export default {
  name: "FindYourBubble",
  components: { MarkerPlacer },
  data() {
    return {
      message: "",
      valid: false,
      addingMessage: false
    };
  },
  watch: {
    message(val) {
      this.message = filter.clean(filter);
    }
  },
  computed: {
    marker() {
      return this.$store.state.marker;
    },
    user() {
      return this.$store.state.user;
    },
    map() {
      return this.$store.state.map;
    }
  },
  mounted() {
    this.map.setZoom(13);
  },
  methods: {
    createNewPin() {
      this.$store
        .dispatch("createNewPin", {
          user: this.user,
          message: this.message,
          marker: this.marker
        })
        .then(r => {
          this.$store.commit("SET_USER_PINS", r);
          this.$store.commit("SET_PLACING", false);
          this.$router.push("/thankyou");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.pin-placer {
  height: 100%;
  pointer-events: none;
}
p {
  margin-bottom: $spacing;
}
.footer {
  pointer-events: all;
  p {
    cursor: pointer;
  }
}
</style>
