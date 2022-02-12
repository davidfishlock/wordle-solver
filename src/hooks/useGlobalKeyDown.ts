import { onMounted, onUnmounted } from "vue";

export default function useGlobalKeyDown(
  onKeyDown: (event: KeyboardEvent) => void,
  options?: boolean | AddEventListenerOptions
) {
  onMounted(() => window.addEventListener("keydown", onKeyDown, options));
  onUnmounted(() => window.removeEventListener("keydown", onKeyDown, options));
}
