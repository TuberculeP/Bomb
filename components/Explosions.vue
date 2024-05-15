<template>
  <div class="explosions-wrapper">
    <div class="explosions-column" v-for="x in mapMatrix.length">
      <div class="explosions-cell" v-for="y in mapMatrix[x - 1].length">
        <transition>
          <div class="explosion" v-if="explosionMatrix[y - 1][x - 1] < 0"></div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { bombList, onBombExplode, explodingSpeed } = useBombs();
const { mapMatrix } = useMap();
const { getPlayerMapIndexes } = usePlayer();
const { revealBonus } = useBonus();

const explosionMatrix = ref([
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]);

onBombExplode(({ location, size, id }, step) => {
  const allCells = [];
  for (let i = 0; i < step; i++) {
    const cells = [
      { x: location.x + i, y: location.y },
      { x: location.x - i, y: location.y },
      { x: location.x, y: location.y + i },
      { x: location.x, y: location.y - i },
    ];
    allCells.push(...cells);
  }
  allCells.forEach((cell) => {
    // if in map
    if (cell.x >= 0 && cell.x < 9 && cell.y >= 0 && cell.y < 9) {
      // check for walls, bricks
      const xDifference = cell.x - location.x;
      const yDifference = cell.y - location.y;
      for (let i = 0; i <= Math.abs(xDifference); i++) {
        const x = location.x + (xDifference > 0 ? i : -i);
        const y = location.y;
        // stop to walls
        if (mapMatrix.value[y][x] === 1) return;
        // dont cross past brocken bricks
        if (step <= size && mapMatrix.value[y][x] === -id) return;
        else if (step > size && mapMatrix.value[y][x] === -id)
          mapMatrix.value[y][x] = 0;
        // if brick,  turn it into brocken brick
        if (step <= size && mapMatrix.value[y][x] === 2) {
          mapMatrix.value[y][x] = -id;
          revealBonus(x, y);
        }
      }
      for (let i = 0; i <= Math.abs(yDifference); i++) {
        const x = location.x;
        const y = location.y + (yDifference > 0 ? i : -i);
        // stop to walls
        if (mapMatrix.value[y][x] === 1) return;
        // dont cross past my brocken bricks (cell === -id)
        if (step <= size && mapMatrix.value[y][x] === -id) return;
        else if (step > size && mapMatrix.value[y][x] === -id)
          mapMatrix.value[y][x] = 0;
        // if brick, turn it into brocken brick
        if (step <= size && mapMatrix.value[y][x] === 2) {
          mapMatrix.value[y][x] = -id;
          revealBonus(x, y);
        }
      }

      // if bomb, explode it
      const maybeBombIndex = bombList.value.findIndex(
        (bomb) => bomb.location.x === cell.x && bomb.location.y === cell.y
      );
      if (maybeBombIndex !== -1 && bombList.value[maybeBombIndex].timeout > 0) {
        bombList.value[maybeBombIndex].timeout = 0;
      }

      if (step > size) {
        console.log(cell);
        const explosionId = explosionMatrix.value[cell.x][cell.y];
        if (explosionId < 0) {
          if (explosionId === -id) {
            explosionMatrix.value[cell.x][cell.y] = 0;
          } else {
            const bombIndex = bombList.value.findIndex(
              (bomb) => bomb.id === -explosionId
            );
            if (bombIndex === -1) {
              explosionMatrix.value[cell.x][cell.y] = 0;
            } else {
              // check if its is last step of explosion
              const bombStep = Math.abs(
                bombList.value[bombIndex].timeout / explodingSpeed
              );
              if (bombStep > bombList.value[bombIndex].size) {
                explosionMatrix.value[cell.x][cell.y] = 0;
              }
            }
          }
        }
      } else {
        explosionMatrix.value[cell.x][cell.y] = -id;
        // if player, kill it
        const { x, y } = getPlayerMapIndexes({ absolute: true });
        if (x === cell.x && y === cell.y) {
          alert("player died");
        }
      }
    }
  });
});
</script>

<style scoped lang="scss">
/* animation for explosion */
.v-enter-from,
.v-leave-to {
  transform: scale(0);
  border-radius: 100%;
}

.v-enter-to {
  transform: scale(1);
  background-color: rgb(154, 0, 0);
}

.v-enter-active {
  transition: all 0.1s;
}
.v-leave-active {
  transition: all 0.3s ease-in;
}

.explosions-wrapper {
  position: absolute;
  z-index: 20;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  .explosions-column {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1/-1;
    .explosions-cell {
      display: grid;
      grid-template-columns: subgrid;
      grid-row: 1/-1;
      .explosion {
        background-color: orange;
        width: 100%;
        height: 100%;
      }
    }
  }
}
.test {
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 100;
  border: 1px solid black;
  width: 192px;
}
</style>
