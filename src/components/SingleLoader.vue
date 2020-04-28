<template>
  <div class="single-loader">
    <img src="@/assets/icons/pin-loader.svg" svg-inline class="loader-icon" />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.loader-icon {
  display: inline-block;
  width: 3rem;
  height: 3rem;
  outline: none;
  animation: spin 10s linear infinite;
  stroke: $col-white;
}
</style>