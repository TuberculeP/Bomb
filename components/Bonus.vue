<template>
  <div class="bonus-wrapper">
    <div :class="`bonus-columns ${y - 1}`" v-for="y in mapMatrix.length">
      <div class="bonus-cells" v-for="x in mapMatrix[y - 1].length">
        <div
          class="bonus"
          :class="{
            [getBonus(x - 1, y - 1).type]: true,
          }"
          v-if="getBonus(x - 1, y - 1)?.visible"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { mapMatrix } = useMap();
const { getBonus } = useBonus();
</script>

<style scoped lang="scss">
.bonus-wrapper {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  .bonus-columns {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1/-1;
    .bonus-cells {
      display: grid;
      grid-template-columns: subgrid;
      grid-row: 1/-1;
      .bonus {
        width: 60%;
        height: 60%;
        background-color: rgb(0, 0, 0);
        border-radius: 10%;
        margin: 20%;
        position: relative;
        &.speed {
          background-color: rgb(0, 255, 0);
        }
        &.range {
          background-color: rgb(0, 0, 255);
        }
        &.bomb {
          background-color: rgb(255, 0, 0);
        }
      }
    }
  }
}
</style>
