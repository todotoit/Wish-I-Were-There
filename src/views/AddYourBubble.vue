<template>
  <div class="view-content">
    <template v-if="!user && step == 0">
      <header>
        <h2 class="expa-large">{{ $t('phase00Username') }}</h2>
        <p class="exte-medium">{{ $t('phase00Desc') }}</p>
        <InputCheck v-slot="{validate}" @validate="valid = $event">
          <input
            type="text"
            v-model="name"
            @input="validate"
            @keyup.enter="next"
            :placeholder="$t('phase00Input')"
            maxlength="15"
          />
        </InputCheck>
      </header>
      <footer>
        <button @click="next" :disabled="!valid">{{ $t('phase00Btn') }}</button>
      </footer>
    </template>
    <template v-else-if="!user && step == 1">
      <header>
        <h2 class="expa-large">{{ $t('phase01Title') }}</h2>
        <p class="exte-medium">{{ $t('phase01Desc') }}</p>
        <MarkerPlacer
          :placeholder="$t('phase01Address')"
          :geolocation="true"
          @update="markerPlaced = true"
        />
      </header>
      <footer>
        <button @click="createNewBubble()" :disabled="!markerPlaced">{{ $t('phase01Btn') }}</button>
      </footer>
    </template>
    <template v-else>
      <header>
        <h2 class="expa-large">{{ $t('phase02Title') }}</h2>
        <p class="exte-medium">{{ $t('phase02Desc') }}</p>
      </header>
      <footer>
        <button @click="$router.push('/pins')">{{ $t('phase02Btn') }}</button>
      </footer>
    </template>
  </div>
</template>

<script>
import MarkerPlacer from "@/components/MarkerPlacer.vue";
import InputCheck from "@/components/InputCheck";
import Events from "@/plugins/events";

export default {
  name: "FindYourBubble",
  components: { MarkerPlacer, InputCheck },
  data() {
    return {
      step: 0,
      name: "",
      valid: true,
      markerPlaced: false
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
      if (!this.valid || !this.markerPlaced) return;
      this.$store
        .dispatch("createNewUser", { name: this.name, marker: this.marker })
        .then(r => {
          this.$store.commit("SET_PLACING", false);
          this.$store.commit("SET_USER", r);
          this.$cookie.set(
            "daydream_user",
            { id: r.id, key: r.key },
            { expires: "1Y" }
          );
          Events.$emit("select-user", r.id);
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

<style>
</style>
