<template>
  <div class="info">
    <div class="header center">
      <p class="large">Mappette Project</p>
      <p
        class="medium"
      >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam suscipit congue dolor faucibus varius. Nam vel urna augue. Duis et accumsan quam. Nunc scelerisque tincidunt felis. Fusce vel facilisis ex, ut scelerisque nulla. Nunc sagittis, arcu in posuere suscipit, neque erat scelerisque tellus, elementum posuere nisi mi sit amet turpis. Proin sagittis iaculis urna ut hendrerit. Sed tempus id metus at lacinia. Ut id tortor vel metus rutrum volutpat.</p>
    </div>
    <div class="footer">
      <button @click="$router.push('/bubble')">Let's Go</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style lang="scss" scoped>
.info p {
  margin-bottom: $spacing;
}
</style>
