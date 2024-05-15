const bonusList = ref<any[]>([]);
function getBonus(x: number, y: number) {
  const bonus = bonusList.value.find(
    (bonus) => bonus.location.x === x && bonus.location.y === y
  );
  return bonus;
}
function spawnBonus(x: number, y: number) {
  if (getBonus(x, y)) return;
  const random = Math.floor(Math.random() * 3);
  const type = ["speed", "range", "bomb"][random];
  bonusList.value.push({
    type,
    location: { x, y },
    visible: false,
  });
}

function collectBonus(x: number, y: number) {
  const bonus = getBonus(x, y);
  if (!bonus) return;
  bonusList.value.splice(bonusList.value.indexOf(bonus), 1);
  return bonus;
}

function revealBonus(x: number, y: number) {
  const bonus = getBonus(x, y);
  if (!bonus) return;
  bonus.visible = true;
}

export const useBonus = () => {
  return { bonusList, getBonus, spawnBonus, collectBonus, revealBonus };
};
