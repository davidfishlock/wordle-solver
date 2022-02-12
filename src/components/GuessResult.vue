<script setup lang="ts">
import { LetterState } from "../types/types";

defineProps<{ result: LetterState[] }>();
</script>

<template>
  <div class="tile-row mb-2">
    <div
      v-for="(letterState, index) in result"
      :key="index"
      :class="[
        {
          invalid: letterState.state === 'invalid',
          partial: letterState.state === 'partial',
          match: letterState.state === 'match',
        },
        'tile',
      ]"
    >
      {{ letterState.letter }}
    </div>
  </div>
</template>
