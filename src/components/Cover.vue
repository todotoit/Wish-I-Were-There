<template>
  <div class="cover-background">

  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.cover-background {
    width: 100%;
    height: 100%;
    background-color: $col-dark;
    background-image: url('~@/assets/img/noise.png');
    background-position: left top;
    animation: play3 0.6s steps(3) infinite;
    opacity: 0.8;    opacity: .5;
    animation: shiftbg .3s infinite;
}
</style>