<template>
  <div class="map">
    <div class="row" v-for="(row, row_idx) in mapMatrix" :key="row_idx">
      <div
        class="cell"
        v-for="(cell, cell_idx) in row"
        :key="cell_idx"
        :class="{ wall: cell === 1, brick: cell === 2 }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { mapMatrix } = useMap();
</script>

<style scoped lang="scss">
.map {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  .row {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1/-1;
    .cell {
      border: 1px solid #2e2e2e;
      background-color: rgb(233, 233, 233);
      &.wall {
        background-color: rgb(45, 45, 71);
      }
      &.brick {
        background-color: rgb(205, 58, 58);
      }
    }
  }
}
</style>
