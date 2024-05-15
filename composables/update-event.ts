import { useEventListener } from "@vueuse/core";

const onUpdateCallbacks = ref<Function[]>([]);

const isBeingRefreshed = ref(false);

export const useUpdateEvent = () => {
  function onUpdate(callback: Function) {
    onUpdateCallbacks.value.push(callback);
  }
  async function start() {
    useEventListener(document, "beforeunload", () => {
      isBeingRefreshed.value = true;
    });
    while (true) {
      // if browser refresh, break the loop
      if (isBeingRefreshed.value) break;
      // call all onUpdateCallbacks
      onUpdateCallbacks.value.forEach((callback) => callback());
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
  }
  return { onUpdate, start };
};
