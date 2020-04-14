<template>
  <div class="info">
    <section class="project">
      <p class="large">{{ $t('aboutTitle') }}</p>
      <p class="medium">{{ $t('aboutDesc') }}</p>
    </section>
    <section class="social">
      <social-sharing
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
            <i class="fa fa-facebook"></i> Facebook
          </network>
          <network network="twitter">
            <i class="fa fa-twitter"></i> Twitter
          </network>
        </div>
      </social-sharing>
    </section>
    <section class="copy">
      <img svg-inline class="logo" src="@/assets/icons/todo-logo.svg" />
    </section>
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
  padding: 0 0.5rem;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $col-dark;
  z-index: 99;
  color: $col-white;
  display: flex;
  flex-direction: column;
  section {
    margin-bottom: 2rem;
    width: 60%;
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
      li {
        font-size: 1.5rem;
        line-height: 120%;
      }
    }
  }
}
.logo {
  path {
    fill: $col-white;
  }
}
</style>
