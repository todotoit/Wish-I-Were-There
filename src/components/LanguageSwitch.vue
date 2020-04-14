<template>
  <div class="language-switch">
    <ul class="languages">
      <li
        v-for="(locale, index) in locales"
        :key="index"
        @click="$i18n.locale = locale"
        :class="{active: locale === $i18n.locale}"
      >{{locale}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$i18n)
  },
  computed: {
    locales() {
      return this.$i18n ? this.$i18n.availableLocales : [];
    }
  }
};
</script>

<style lang="scss">
.language-switch {
  ul,li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul {
    li {
      color: $col-green;
      display: inline-block;
      text-transform: uppercase;
      cursor: pointer;
      &.active {
        text-decoration: underline;
      }
      &:not(:last-child) {
        margin-right: .5rem;
      }
    }
  }
}
</style>