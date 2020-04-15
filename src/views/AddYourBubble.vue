<template>
  <div class="info">
    <template v-if="!user && step == 0">
      <div class="header">
        <p class="expa-large">{{ $t('phase00Username') }}</p>
        <p class="exte-medium">{{ $t('phase00Desc') }}</p>
        <InputCheck v-slot="{validate}" @validate="valid = $event">
          <input
            type="text"
            v-model="name"
            @input="validate"
            :placeholder="$t('phase00Input')"
            maxlength="15"
          />
        </InputCheck>
      </div>
      <div class="footer">
        <button @click="next" :disabled="!valid">{{ $t('phase00Btn') }}</button>
      </div>
    </template>
    <template v-else-if="!user && step == 1">
      <div class="header">
        <p class="expa-large">{{ $t('phase01Title') }}</p>
        <p class="exte-medium">{{ $t('phase01Desc') }}</p>
        <MarkerPlacer :placeholder="$t('phase01Address')" />
      </div>
      <div class="footer">
        <button @click="createNewBubble()">{{ $t('phase01Btn') }}</button>
      </div>
    </template>
    <template v-else>
      <div class="header">
        <p class="expa-large">{{ $t('phase02Title') }}</p>
        <p class="exte-medium">{{ $t('phase02Desc') }}</p>
      </div>
      <div class="footer">
        <button @click="$router.push('/pins')">{{ $t('phase02Btn') }}</button>
      </div>
    </template>
  </div>
</template>

<script>
import MarkerPlacer from "@/components/MarkerPlacer.vue";
import InputCheck from "@/components/InputCheck";
import Events from "@/events";

export default {
  name: "FindYourBubble",
  components: { MarkerPlacer, InputCheck },
  data() {
    return {
      step: 0,
      name: "",
      valid: true
    };
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
    if (this.$store.state.user) return this.$router.push("/explore");
    this.$store.commit("SET_PLACING", true);
  },
  methods: {
    createNewBubble() {
      this.$store
        .dispatch("createNewUser", { name: this.name, marker: this.marker })
        .then(r => {
          this.$store.commit("SET_PLACING", false);
          this.$store.commit("SET_USER", r);
          Events.$emit("select-user", r.id);
          this.$cookie.set("daydream_user", r.id, { expires: "1Y" });
        });
    },
    next() {
      this.step = 1;
    },
    prev() {
      this.step = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  input,
  /deep/ input {
    margin-top: 1.5rem;
  }
}
</style>
