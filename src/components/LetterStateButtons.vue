<script setup lang="ts">
import { LetterState, MatchState } from "../types/letters";
import { toRefs } from "vue";

const emit = defineEmits<{
  (e: "update:letter-state", state: LetterState): void;
}>();

const props = defineProps<{ letterState: LetterState }>();

const { letterState } = toRefs(props);

const onMatchStateChanged = (state: MatchState) => {
  emit("update:letter-state", { ...letterState.value, state });
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
