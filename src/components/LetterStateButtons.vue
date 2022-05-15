<template>
  <div class="flex space-x-1 w-1/5">
    <button
      class="invalid w-1/3 aspect-square"
      @click="onMatchStateChanged(MatchState.Invalid)"
    ></button>
    <button
      class="partial w-1/3 aspect-square"
      @click="onMatchStateChanged(MatchState.Partial)"
    ></button>
    <button
      class="match w-1/3 aspect-square"
      @click="onMatchStateChanged(MatchState.Match)"
    ></button>
  </div>
</template>

<script setup lang="ts">
import { MatchState } from "../types/guess";

const emit = defineEmits<{
  (e: "update:letter-state", letterIndex: number, state: MatchState): void;
}>();

const props = defineProps<{ letterIndex: number; state: MatchState }>();

const onMatchStateChanged = (state: MatchState) => {
  emit("update:letter-state", props.letterIndex, state);
};
</script>
