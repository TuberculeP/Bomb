const { onUpdate } = useUpdateEvent();

interface Bomb {
  location: { x: number; y: number };
  timeout: number;
  size: number;
  id: number;
}

const explodingSpeed = 15;

const bombList = ref<Bomb[]>([]);

const totalSpawnedBombs = ref(0);

const onBombExplodeList = ref<((bomb: Bomb, step: number) => void)[]>([]);

const onBombExplode = (callback: (typeof onBombExplodeList.value)[number]) => {
  onBombExplodeList.value.push(callback);
};

function spawnBomb(location: { x: number; y: number }, size: number) {
  totalSpawnedBombs.value++;
  bombList.value.push({
    location,
    size,
    timeout: 300,
    id: totalSpawnedBombs.value,
  });
  return totalSpawnedBombs.value;
}

function explode(bomb: Bomb) {
  if (bomb.timeout % explodingSpeed === 0)
    onBombExplodeList.value.forEach((callback) =>
      callback(bomb, Math.abs(bomb.timeout / explodingSpeed))
    );

  if (bomb.timeout === -((bomb.size + 1) * explodingSpeed)) {
    bombList.value.splice(bombList.value.indexOf(bomb), 1);
  }
}

onUpdate(() => {
  bombList.value.forEach((bomb, index) => {
    bombList.value[index].timeout--;
    if (bomb.timeout <= 0) {
      explode(bomb);
    }
  });
});

export const useBombs = () => {
  return { bombList, onBombExplode, explodingSpeed, spawnBomb };
};
