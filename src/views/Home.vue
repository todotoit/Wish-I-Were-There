<template>
  <div class="home">
    <h2>Mappette</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam suscipit congue dolor faucibus varius. Nam vel urna augue. Duis et accumsan quam. Nunc scelerisque tincidunt felis. Fusce vel facilisis ex, ut scelerisque nulla. Nunc sagittis, arcu in posuere suscipit, neque erat scelerisque tellus, elementum posuere nisi mi sit amet turpis. Proin sagittis iaculis urna ut hendrerit. Sed tempus id metus at lacinia. Ut id tortor vel metus rutrum volutpat.</p>
    <p>
      <button @click="$router.push('/bubble')">Find your bubble</button>
    </p>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style lang="scss" scoped>
.home {
  background-color: #1D1B26;
  width: 100%;
  height: 100%;
  pointer-events: all;
}
</style>
