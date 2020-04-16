<template>
  <div class="home-animations">
    <img src="@/assets/img/home-assets.svg" svg-inline class="items" :width="width" />
  </div>
</template>

<script>
import gsap from "gsap";

export default {
  data() {
    return {
      stars: [],
      bubbles: [],
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  mounted() {
    gsap.to(".home-container", 10, {
      y: "+=30",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    const paths = Array.from(document.getElementsByClassName("link"));
    paths.forEach(s => {
      gsap.to(s, 6, {
        strokeDashoffset: 100,
        repeat: -1,
        yoyo: true,
        delay: 0,
        ease: "sine.inOut"
      });
    });
  }
};
</script>

<style lang="scss">
.home-animations {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 202;
  background-color: transparent;
  .items {
    width: 100%;
    height: 100%;
  }
  svg {
    .star path {
      animation: float 5s infini;
    }
  }
}
</style>