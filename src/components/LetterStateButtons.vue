<script setup lang="ts">
import { MatchState } from "../types/types";

const emit = defineEmits<{
  (e: "update:letter-state", letterIndex: number, state: MatchState): void;
}>();

const props = defineProps<{ letterIndex: number; state: MatchState }>();

const onMatchStateChanged = (state: MatchState) => {
  emit("update:letter-state", props.letterIndex, state);
};
</script>

<template>
  <div class="flex space-x-1 w-1/5">
    <button
      class="invalid w-1/3 aspect-square"
      @click="onMatchStateChanged('invalid')"
    ></button>
    <button
      class="partial w-1/3 aspect-square"
      @click="onMatchStateChanged('partial')"
    ></button>
    <button
      class="match w-1/3 aspect-square"
      @click="onMatchStateChanged('match')"
    ></button>
  </div>
</template>

<style scoped></style>
