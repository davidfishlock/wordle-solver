<template>
  <div class="tile-row mb-2">
    <div
      v-for="(letterState, index) in result"
      :key="index"
      :class="[
        {
          invalid: letterState.state === MatchState.Invalid,
          partial: letterState.state === MatchState.Partial,
          match: letterState.state === MatchState.Match,
        },
        'tile',
      ]"
    >
      {{ letterState.letter }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Guess, MatchState } from "../types/guess";

defineProps<{ result: Guess }>();
</script>
