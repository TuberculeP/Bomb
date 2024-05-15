<template>
  <div class="player-wrapper">
    <div class="sprite"></div>
  </div>
</template>

<script lang="ts" setup>
const {
  CSSplayerWidth,
  CSSplayerHeight,
  CSSplayerTop,
  CSSplayerLeft,
  CSSplayerPadding,
} = usePlayer();
</script>

<style scoped lang="scss">
.player-wrapper {
  position: absolute;
  z-index: 100;
  width: v-bind(CSSplayerWidth);
  height: v-bind(CSSplayerHeight);
  top: v-bind(CSSplayerTop);
  left: v-bind(CSSplayerLeft);
  padding: v-bind(CSSplayerPadding);

  .sprite {
    background-color: blue;
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
</style>
