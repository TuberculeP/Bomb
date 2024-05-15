import { onKeyDown, onKeyUp } from "@vueuse/core";

const { keybinds, movingKeybinds } = useKeybinds();
const { onMapResize, mapMatrix, mapInfos } = useMap();
const { spawnBomb, onBombExplode } = useBombs();
const { collectBonus } = useBonus();

const baseSpeed = ref(0.03);

const playerInfos = reactive({
  width: mapInfos.cellSize,
  height: mapInfos.cellSize,
  top: 0,
  left: 0,
  speed: baseSpeed.value,
  bombs: 1,
  range: 2,
});

const spawnedBombIds = ref<number[]>([]);

onMapResize((oldValue) => {
  playerInfos.width = mapInfos.cellSize;
  playerInfos.height = mapInfos.cellSize;
  // calculate new top/left based on oldValue.cellSize
  if (oldValue.cellSize === 0) return;
  playerInfos.top = (playerInfos.top / oldValue.cellSize) * mapInfos.cellSize;
  playerInfos.left = (playerInfos.left / oldValue.cellSize) * mapInfos.cellSize;
  const oldPlayerSpeed = playerInfos.speed;
  baseSpeed.value = mapInfos.cellSize / 50;
  playerInfos.speed = oldPlayerSpeed * (mapInfos.cellSize / oldValue.cellSize);
});

const { onUpdate } = useUpdateEvent();

const movingKeybindsQueue = ref<string[]>([]);
const currentDirection = ref<string | null>(null);

function snapToGrid() {
  const queue = unref(movingKeybindsQueue);
  if (!queue || !queue.length) return;
  // if value is vertical and player is not vertically centered
  if ([...keybinds.left, ...keybinds.right].includes(queue[0])) {
    if (playerInfos.top % mapInfos.cellSize !== 0) {
      playerInfos.top =
        Math.round(playerInfos.top / mapInfos.cellSize) * mapInfos.cellSize;
    }
  }
  // if value is horizontal and player is not horizontally centered
  if ([...keybinds.up, ...keybinds.down].includes(queue[0])) {
    if (playerInfos.left % mapInfos.cellSize !== 0) {
      playerInfos.left =
        Math.round(playerInfos.left / mapInfos.cellSize) * mapInfos.cellSize;
    }
  }
}

onKeyUp(
  movingKeybinds.value,
  (event) => {
    let correctedKey: string | null = null;
    Object.values(keybinds).every((value) => {
      if (value.includes(event.key)) correctedKey = value[0];
      return !correctedKey;
    });
    movingKeybindsQueue.value = movingKeybindsQueue.value.filter(
      (key) => key !== correctedKey
    );
  },
  {
    dedupe: true,
  }
);

onKeyDown(
  movingKeybinds.value,
  ({ key }) => {
    Object.values(keybinds).every((keybind) => {
      if (keybind.includes(key)) {
        movingKeybindsQueue.value.unshift(keybind[0]);
        return false;
      }
      return true;
    });
  },
  {
    dedupe: true,
  }
);

onKeyDown([" "], () => {
  if (spawnedBombIds.value.length >= playerInfos.bombs) return;
  const { x, y } = getPlayerMapIndexes({ absolute: true });
  const bombId = spawnBomb({ x, y }, playerInfos.range);
  spawnedBombIds.value.push(bombId);
});

onBombExplode(({ id }) => {
  spawnedBombIds.value = spawnedBombIds.value.filter((bombId) => bombId !== id);
});

function getPlayerMapIndexes(params?: {
  direction?: string;
  absolute?: boolean;
}) {
  const direction = params?.direction || currentDirection.value;
  if (!direction) return { x: 0, y: 0 };
  const roundFunction = params?.absolute
    ? Math.round
    : ["z", "q"].includes(direction)
    ? Math.ceil
    : Math.floor;
  return {
    x: roundFunction(playerInfos.left / mapInfos.cellSize),
    y: roundFunction(playerInfos.top / mapInfos.cellSize),
  };
}

function getMoveCallbackByDirection(direction: string) {
  switch (direction) {
    case keybinds.up[0]:
      return () => (playerInfos.top -= playerInfos.speed);
    case keybinds.down[0]:
      return () => (playerInfos.top += playerInfos.speed);
    case keybinds.left[0]:
      return () => (playerInfos.left -= playerInfos.speed);
    case keybinds.right[0]:
      return () => (playerInfos.left += playerInfos.speed);
  }
}

function checkColliders(direction: string): boolean {
  let { x, y } = getPlayerMapIndexes({ direction });
  switch (direction) {
    case "z":
      y--;
      break;
    case "s":
      y++;
      break;
    case "q":
      x--;
      break;
    case "d":
      x++;
      break;
  }
  if (
    x < 0 ||
    y < 0 ||
    x >= mapMatrix.value[0].length ||
    y >= mapMatrix.value.length
  )
    return false;
  const cell = mapMatrix.value[y][x];
  if (cell > 0) return false;
  return true;
}

onUpdate(() => {
  if (movingKeybindsQueue.value.length) {
    snapToGrid();
    movingKeybindsQueue.value.every((direction) => {
      if (checkColliders(direction)) {
        currentDirection.value = direction;
        const moveCallback = getMoveCallbackByDirection(direction);
        moveCallback && moveCallback();
        return false;
      }
      return true;
    });
    // check if player is on a bonus
    const { x, y } = getPlayerMapIndexes({ absolute: true });
    const bonus = collectBonus(x, y);
    if (bonus) {
      switch (bonus.type) {
        case "speed":
          playerInfos.speed += baseSpeed.value / 2;
          break;
        case "range":
          playerInfos.range++;
          break;
        case "bomb":
          playerInfos.bombs++;
          break;
      }
    }
  }
});

export const usePlayer = () => {
  const CSSplayerWidth = computed(() => `${playerInfos.width}px`);
  const CSSplayerHeight = computed(() => `${playerInfos.height}px`);
  const CSSplayerTop = computed(() => `${playerInfos.top}px`);
  const CSSplayerLeft = computed(() => `${playerInfos.left}px`);
  const CSSplayerPadding = computed(() => `${playerInfos.width / 10}px`);
  return {
    playerInfos,
    getMoveCallbackByDirection,
    CSSplayerWidth,
    CSSplayerHeight,
    CSSplayerTop,
    CSSplayerLeft,
    CSSplayerPadding,
    getPlayerMapIndexes,
  };
};
