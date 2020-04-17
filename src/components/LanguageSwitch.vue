<template>
  <div class="language-switch">
    <ul class="languages">
      <li
        v-for="(locale, index) in locales"
        :key="index"
        @click="$i18n.locale = locale"
        :class="{active: locale === $i18n.locale}"
        class="thin-large"
      >{{locale}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    locales() {
      return this.$i18n ? this.$i18n.availableLocales : [];
    }
  }
};
</script>

<style lang="scss">
.language-switch {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      color: $col-green;
      display: inline-block;
      text-transform: uppercase;
      pointer-events: all;
      cursor: pointer;
      &.active {
        text-decoration: underline;
      }
      &:not(:last-child) {
        margin-right: 0.5rem;
        @media screen and (max-width: $mqTablet) {
          margin-right: 1.5rem;
        }
      }
    }
  }
}
</style>
