<template>
  <div class="view-content">
    <template v-if="!addingMessage">
      <header>
        <h2 class="expa-large">{{ $t('phase03Title') }}</h2>
        <p class="exte-medium">{{ $t('phase03Desc') }}</p>
        <MarkerPlacer type="pin" :placeholder="$t('phase03Input')" @update="markerPlaced = true" />
      </header>
      <footer>
        <button @click="addingMessage = true" :disabled="!markerPlaced">{{ $t('phase03Btn') }}</button>
        <a @click="$router.push('/explore')">{{ $t('phase03Skip') }}</a>
      </footer>
    </template>
    <template v-else>
      <header>
        <h2 class="expa-large">{{ $t('phase04Title') }}</h2>
        <p class="exte-medium">{{ $t('phase04Desc') }}</p>
        <InputCheck v-slot="{validate}" @validate="valid = $event" :empty="false">
          <div class="textarea-wrap">
            <textarea
              :placeholder="$t('phase04Input')"
              v-model="message"
              @input="validate"
              :maxlength="messageLength"
              class="exte-small"
            ></textarea>
            <span class="char-count">{{message.length}}/{{messageLength}}</span>
          </div>
        </InputCheck>
      </header>
      <footer>
        <button @click="createNewPin" :disabled="!message" v-if="!loading">{{ $t('phase04Btn') }}</button>
        <SingleLoader v-else />
      </footer>
    </template>
  </div>
</template>

<script>
import SingleLoader from "@/components/SingleLoader";
import MarkerPlacer from "@/components/MarkerPlacer.vue";
import InputCheck from "@/components/InputCheck";
import { cleanInput } from "@/utils";

export default {
  name: "AddYourPins",
  components: { MarkerPlacer, InputCheck, SingleLoader },
  data() {
    return {
      message: "",
      valid: false,
      addingMessage: false,
      messageLength: 200,
      markerPlaced: false,
      loading: false
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
    this.map.setZoom(13);
  },
  methods: {
    createNewPin() {
      if (!this.valid || !this.markerPlaced) return;
      this.loading = true;
      this.$store
        .dispatch("createNewPin", {
          user: this.user,
          message: this.message,
          marker: this.marker
        })
        .then(r => {
          this.loading = false;
          this.$store.commit("SET_USER_PINS", r);
          this.$store.commit("SET_PLACING", false);
          this.$router.push("/thankyou");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: $mqTablet) {
  ::v-deep .input-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.textarea-wrap {
  position: relative;
  width: 26rem;
  margin: 1rem auto;
  border: 1px solid white;
  background-color: $col-dark;
  padding: $spacing / 2;
  padding-bottom: $spacing / 4;
  @media screen and (max-width: $mqTablet) {
    width: 95%;
    margin-top: 1rem;
    padding: $spacing / 4;
  }
  textarea {
    box-sizing: border-box;
    outline: 0;
    padding: 0;
    resize: none;
    color: $col-green;
    background-color: transparent;
    width: 100%;
    min-height: 8rem;
    border: none;
  }
  .char-count {
    display: block;
    text-align: right;
    font-size: 0.75rem;
    opacity: 0.5;
    margin-bottom: 0;
  }
}
</style>
