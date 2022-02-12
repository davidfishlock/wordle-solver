<script setup lang="ts">
import { Guess, MatchState } from "../types/types";
import LetterStateButtons from "./LetterStateButtons.vue";
import { replaceAt } from "../utils/array";

const emit = defineEmits<{
  (e: "update:guess", guess: Guess): void;
}>();

const props = defineProps<{
  guess: Guess;
}>();

function onStateUpdated(letterIndex: number, state: MatchState) {
  const updatedGuess = replaceAt(props.guess, letterIndex, {
    letter: props.guess[letterIndex].letter,
    state,
  });
  emit("update:guess", updatedGuess);
}
</script>

<template>
  <div>
    <div class="tile-row mb-2">
      <div
        v-for="(letterState, index) in guess"
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

    <div class="tile-row mb-4">
      <LetterStateButtons
        :letter-index="0"
        :state="guess[0].state"
        @update:letter-state="onStateUpdated"
      />
      <LetterStateButtons
        :letter-index="1"
        :state="guess[1].state"
        @update:letter-state="onStateUpdated"
      />
      <LetterStateButtons
        :letter-index="2"
        :state="guess[2].state"
        @update:letter-state="onStateUpdated"
      />
      <LetterStateButtons
        :letter-index="3"
        :state="guess[3].state"
        @update:letter-state="onStateUpdated"
      />
      <LetterStateButtons
        :letter-index="4"
        :state="guess[4].state"
        @update:letter-state="onStateUpdated"
      />
    </div>
  </div>
</template>

<style scoped></style>
