import { reactive } from "vue";

const keybinds = reactive({
  up: ["z", "Z", "ArrowUp"],
  down: ["s", "S", "ArrowDown"],
  left: ["q", "Q", "ArrowLeft"],
  right: ["d", "D", "ArrowRight"],
});

export const useKeybinds = () => {
  const movingKeybinds = computed(() => ([
    ...keybinds.up,
    ...keybinds.down,
    ...keybinds.left,
    ...keybinds.right,
  ]));

  return { keybinds, movingKeybinds };
};
