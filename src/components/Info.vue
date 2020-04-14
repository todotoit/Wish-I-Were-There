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
        <!-- <social-sharing
        url="https://vuejs.org/"
        title="The Progressive JavaScript Framework"
        description="Intuitive, Fast and Composable MVVM for building interactive interfaces."
        quote="Vue is a progressive framework for building user interfaces."
        hashtags="vuejs,javascript,framework"
        twitter-user="vuejs"
        inline-template
      >
        <div>
          <network network="facebook">
            <i class="fa fa-facebook"></i> <span class="exte-small"> Facebook </span>
          </network>
          <network network="twitte">
            <i class="fa fa-twitter"></i>  <span class="exte-small"> Twitter </span>
          </network>
        </div>
        </social-sharing>-->
      </section>
      <section class="copy">
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
.info {
  position: absolute;
  z-index: 201;
  padding: 1rem;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $col-dark;
  color: $col-white;
  display: flex;
  flex-direction: column;
  .wrapper {
    margin-top: 3rem;
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
