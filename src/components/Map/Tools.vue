<template>
  <div class="tools">
    <div class="tools-wrap">
      <p class="exte-small">{{ $t('exploreMode') }}</p>
      <ul>
        <li :class="{active: showUserMarkers}" class="exte-small" @click="$emit('toggle-users');">
          <img src="@/assets/icons/bubble.svg" svg-inline class="toggle-icon" />
          {{ $t('exploreSelf') }}
        </li>
        <li :class="{active: showPinMarkers}" class="exte-small" @click="$emit('toggle-pins');">
          <img src="@/assets/icons/pin.svg" svg-inline class="toggle-icon" />
          {{ $t('exploreDayDream') }}
        </li>
      </ul>
    </div>
    <div class="tools-bg"></div>
  </div>
</template>

<script>
export default {
  name: "Tools",
  props: {
    showUserMarkers: {
      type: Boolean,
      default: true
    },
    showPinMarkers: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="scss">
.tools {
  position: relative;
  text-align: left;
  .toggle-icon {
    width: 2rem;
    outline: none;
  }
  p {
    color: $col-green;
    text-transform: uppercase;
    font-family: "GT America Expanded";
    padding-bottom: 0.5rem;
    border-bottom: 1px solid $col-white;
    @media screen and (max-width: $mqMobile) {
      width: 80%;
    }
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 0.5rem;
    li {
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      opacity: 0.5;
      @media screen and (max-width: $mqMobile) {
        margin-bottom: .25rem;
      }
      cursor: pointer;
      pointer-events: all;
      &.active {
        opacity: 1;
      }
      svg {
        margin-right: 0.5rem;
      }
    }
  }
  .tools-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 1;
  }
  .tools-wrap {
    position: relative;
    padding: 1rem;
    @media screen and (max-width: $mqMobile) {
      padding: 0rem;
    }
    z-index: 2;
  }
  .tools-bg {
    background-color: rgba($col-dark, 0.7);
    mix-blend-mode: multiply;
    filter: blur(1rem);
  }
}
</style>
