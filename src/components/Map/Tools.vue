<template>
  <div class="tools">
    <p class="exte-small">{{ $t('exploreMode') }}</p>
    <ul>
      <li :class="{active: showUserMarkers}" class="exte-small" @click="$emit('toggle-users');">
        <img src="@/assets/icons/bubble-small.svg" svg-inline class="toggle-icon" />
        {{ $t('exploreSelf') }}
      </li>
      <li :class="{active: showPinMarkers}" class="exte-small" @click="$emit('toggle-pins');">
        <img src="@/assets/icons/pin-small.svg" svg-inline class="toggle-icon" />
        {{ $t('exploreDayDream') }}
      </li>
    </ul>
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
  position: absolute;
  left: 1rem;
  top: 1rem;
  z-index: 20;
  p {
    color: $col-green;
    text-transform: uppercase;
    font-family: "GT America Expanded";
    padding-bottom: 0.5rem;
    border-bottom: 1px solid $col-white;
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
      cursor: pointer;
      &.active {
        opacity: 1;
      }
      svg {
        margin-right: 0.5rem;
      }
    }
  }
}
</style>