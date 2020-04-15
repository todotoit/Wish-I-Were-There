<template>
  <div class="info">
    <div class="wrapper">
      <section class="project">
        <p class="expa-large">{{ $t('aboutTitle') }}</p>
        <p class="exte-large">{{ $t('aboutDesc') }}</p>
      </section>
      <section class="social">
        <a target="_blank" class="exte-medium" href="https://www.facebook.com/todotoit">Facebook</a>
        <a
          target="_blank"
          class="exte-medium"
          href="https://www.instagram.com/todotoit/?hl=it"
        >Instagram</a>
        <a target="_blank" class="exte-medium" href="https://twitter.com/todotoit">Twitter</a>
      </section>
      <section class="copy">
        <a target="_blank" class="exte-medium" href="https://todo.to.it/">
          <img svg-inline class="logo" src="@/assets/icons/todo-logo.svg" />
        </a>
      </section>
    </div>
    <Cover />
  </div>
</template>

<script>
import Cover from "@/components/Cover";
export default {
  name: "Info",
  components: { Cover }
};
</script>

<style lang="scss" scoped>
.info {
  position: absolute;
  z-index: 201;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $col-dark;
  color: $col-white;
  display: flex;
  flex-direction: column;
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 1rem;
    padding-top: 3rem;
    z-index: 10;
    section {
      margin-bottom: 2rem;
      width: 60%;
    }
    .social {
      a {
        color: $col-white;
        margin-right: 0.5rem;
        &:hover {
          color: $col-green;
        }
      }
    }
    .logo {
      path {
        fill: $col-white;
      }
    }
  }
}
</style>
