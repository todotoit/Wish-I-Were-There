<template>
  <div class="info-panel view">
    <div class="view-content">
      <section class="project">
        <p class="expa-large title">{{ $t('aboutTitle') }}</p>
        <div class="exte-large desc" v-html="$t('aboutDesc')"></div>
      </section>
      <section class="social">
        <a target="_blank" class="exte-medium" href="https://www.facebook.com/todotoit">Facebook</a>
        <a
          target="_blank"
          class="exte-medium"
          href="https://www.instagram.com/todotoit/?hl=it"
        >Instagram</a>
        <a target="_blank" class="exte-medium" href="https://vimeo.com/todotoit">Vimeo</a>
      </section>
      <section class="copyright">
        <a target="_blank" class="exte-medium" href="https://todo.to.it/">
          <img svg-inline class="logo" src="@/assets/icons/todo-logo.svg" />
        </a>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "Info"
};
</script>

<style lang="scss" scoped>
.info-panel {
  position: absolute;
  z-index: 201;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: $col-white;
  text-align: left;
  overflow: auto;
  pointer-events: all;
  ::v-deep .project p {
    margin-bottom: 1rem;
  }
  section {
    margin-bottom: 2rem;
    width: 60%;
    @media screen and (max-width: $mqTablet) {
      width: 100%;
    }
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
</style>
