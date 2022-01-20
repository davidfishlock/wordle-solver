<script setup lang="ts">
import { LetterState } from "../types/letters";

defineProps<{ result: LetterState[] }>();
</script>

<template>
  <div class="root">
    <div
      v-for="(letterState, index) in result"
      :key="index"
      :class="[
        {
          invalid: letterState.state === 'invalid',
          partial: letterState.state === 'partial',
          match: letterState.state === 'match',
        },
        'letter',
      ]"
    >
      {{ letterState.letter }}
    </div>
  </div>
</template>

<style scoped>
.root {
  display: flex;
  margin-bottom: 4px;
}
.letter {
  display: flex;
  height: 48px;
  width: 48px;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  margin-right: 4px;
}
</style>
