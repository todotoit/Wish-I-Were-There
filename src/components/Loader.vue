<template>
  <div class="loader">
    <div class="wrap">
      <div>
        <img src="@/assets/icons/pin.svg" svg-inline class="loader-icon" />
      </div>
    </div>
  </div>
</template>

<script>

export default {

};
</script>

<style lang="scss" scoped>
.loader {
  .wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
    & > div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
  h3 {
    text-transform: uppercase;
    font-size: 2rem;
  }
  .loader-icon {
    display: block;
    width: 4rem;
    height: 4rem;
    outline: none;
    animation: spin 10s linear infinite;
  }
}
</style>