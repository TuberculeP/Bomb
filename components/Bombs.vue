<template>
  <div class="bombs-wrapper">
    <div :class="`bomb-columns ${y - 1}`" v-for="y in mapMatrix.length">
      <div class="bomb-cells" v-for="x in mapMatrix[y - 1].length">
        <div
          class="bomb"
          :class="{
            'about-to-explode': bombList.some(
              (bomb) =>
                bomb.location.x === x - 1 &&
                bomb.location.y === y - 1 &&
                bomb.timeout < 100
            ),
          }"
          v-if="
            bombList.some(
              (bomb) => bomb.location.x === x - 1 && bomb.location.y === y - 1
            )
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { bombList } = useBombs();
const { mapMatrix } = useMap();
</script>

<style scoped lang="scss">
@keyframes bombTriggered {
  0% {
    transform: scale(0.8);
    background-color: rgb(0, 0, 0);
  }
  100% {
    transform: scale(1);
    background-color: rgb(154, 0, 0);
  }
}

.bombs-wrapper {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  .bomb-columns {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1/-1;
    .bomb-cells {
      display: grid;
      grid-template-columns: subgrid;
      grid-row: 1/-1;
      .bomb {
        width: 80%;
        height: 80%;
        background-color: rgb(0, 0, 0);
        border-radius: 50%;
        margin: 10%;
        position: relative;
        animation: bombTriggered 0.5s alternate infinite;
        &.about-to-explode {
          animation: bombTriggered 0.2s alternate infinite;
        }
        &::before {
          content: "";
          position: absolute;
          top: -10%;
          left: 50%;
          width: 10%;
          height: 20%;
          background-color: rgb(195, 176, 140);
        }
      }
    }
  }
}
</style>
