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
      </div>
      <div class="footer">
        <button @click="createNewPin" :disabled="!message">{{ $t('phase04Btn') }}</button>
      </div>
    </template>
  </div>
</template>

<script>
import MarkerPlacer from "@/components/MarkerPlacer.vue";
import InputCheck from "@/components/InputCheck";
import { cleanInput } from "@/utils";

export default {
  name: "AddYourPins",
  components: { MarkerPlacer, InputCheck },
  data() {
    return {
      message: "",
      valid: false,
      addingMessage: false,
      messageLength: 200
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
      if (!this.valid) return;
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
input,
/deep/ input {
  margin-top: 1.5rem;
  @media screen and (max-width: $mqTablet) {
    margin-top: 0.5rem;
  }
}
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
