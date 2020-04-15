<template>
  <div class="input-container">
    <slot :validate="validate"></slot>
    <p class="msg-error" v-for="(message, index) in messages" :key="index">{{ message }}</p>
  </div>
</template>

<script>
import { checkInput } from "@/utils";

export default {
  props: {
    empty: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      value: "",
      valid: false,
      messages: []
    };
  },
  mounted() {
    if (!this.value && this.empty) this.valid = true;
  },
  methods: {
    validate(e) {
      this.messages = [];
      const val = e.target.value;
      this.valid = this.checkIfEmpty(val);
      if (!this.valid) {
        this.messages.push(this.$t("errorEmptyMessage"));
      } else {
        this.valid = checkInput(val);
        if (!this.valid) this.messages.push(this.$t("errorBadMessage"));
      }
      this.$emit("validate", this.valid);
    },
    checkIfEmpty(val) {
      if ((!val || val.length <= 0) && !this.empty) return false;
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.msg-error {
    color: $col-green;
    font-size: .8rem;
}
</style>