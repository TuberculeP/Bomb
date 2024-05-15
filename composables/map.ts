import { useResizeObserver } from "@vueuse/core";

const { spawnBonus } = useBonus();

const globalMap = ref<HTMLElement | null>(null);

const mapMatrix = ref<number[][]>([
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]);

const maxBricks = 25;

const mapLength = mapMatrix.value.length;

const forbiddenCells = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
  [0, mapLength - 1],
  [0, mapLength - 2],
  [1, mapLength - 1],
  [1, mapLength - 2],
  [mapLength - 1, 0],
  [mapLength - 1, 1],
  [mapLength - 2, 0],
  [mapLength - 2, 1],
  [mapLength - 1, mapLength - 1],
  [mapLength - 1, mapLength - 2],
  [mapLength - 2, mapLength - 1],
  [mapLength - 2, mapLength - 2],
];

const mapInfos = reactive({
  width: 0,
  height: 0,
  cellSize: 0,
});

const mapResizeCallbacks = ref<((oldValue: Record<string, number>) => void)[]>(
  []
);

export const useMap = () => {
  function populateWithBricksAndBonus() {
    let placedBricks = 0;
    while (placedBricks < maxBricks) {
      // we need to place a brick, but not in the corners (use trigo)
      const randomX = Math.floor(Math.random() * mapMatrix.value[0].length);
      const randomY = Math.floor(Math.random() * mapMatrix.value.length);
      if (
        forbiddenCells.some(
          (cell) => cell[0] === randomY && cell[1] === randomX
        )
      )
        continue;
      if (mapMatrix.value[randomY][randomX] !== 0) continue;
      mapMatrix.value[randomY][randomX] = 2;
      placedBricks++;
      placedBricks % 2 === 0 && spawnBonus(randomX, randomY);
    }
  }

  const onMapResize = (callback: (typeof mapResizeCallbacks.value)[number]) => {
    mapResizeCallbacks.value.push(callback);
  };

  const cleanMapSize = (width: number, height: number) => {
    if (!globalMap.value) return;
    const maxSize = Math.min(width, height);
    const finalWidth = Math.floor(maxSize / 9) * 9;
    const finalHeight = Math.floor(maxSize / 9) * 9;

    mapInfos.width = finalWidth;
    mapInfos.height = finalHeight;
    mapInfos.cellSize = finalWidth / mapMatrix.value[0].length;

    globalMap.value.style.width = `${finalWidth}px`;
    globalMap.value.style.height = `${finalHeight}px`;
  };

  const registerMap = (mapHTML: HTMLElement | null) => {
    if (!mapHTML) return;
    globalMap.value = mapHTML;
    cleanMapSize(globalMap.value.offsetWidth, globalMap.value.offsetHeight);
    populateWithBricksAndBonus();
    useResizeObserver(document.body, ([entry]) => {
      const { width, height } = entry.contentRect;
      const oldWidth = mapInfos.width;
      const oldHeight = mapInfos.height;
      const oldCellSize = mapInfos.cellSize;
      cleanMapSize(width, height);
      mapResizeCallbacks.value.forEach((callback) =>
        callback({ width: oldWidth, height: oldHeight, cellSize: oldCellSize })
      );
    });
  };

  const isMapMounted = computed(() => globalMap.value !== null);

  return {
    registerMap,
    mapMatrix,
    isMapMounted,
    mapInfos,
    onMapResize,
  };
};
