<template>
  <div class="playground">
    <Player />
    <Bonus />
    <Explosions />
    <Bombs />
    <Map />
  </div>
</template>

<script lang="ts" setup>
const { registerMap } = useMap();
onMounted(() => {
  const gamePlayground = document.querySelector(".playground") as HTMLElement;
  registerMap(gamePlayground);
  useUpdateEvent().start();
});
</script>

<style>
div.playground {
  position: relative;
  margin: 0 auto;
  max-height: 100vh;
  max-width: 100%;
  aspect-ratio: 1/1;
}
</style>
