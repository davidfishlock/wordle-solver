<script setup lang="ts">
import GuessInput from "./components/GuessInput.vue";
import GuessResult from "./components/GuessResult.vue";
import Suggestions from "./components/Suggestions.vue";

import { getUpdatedGameState } from "./utils/guess";
import { wordList } from "./data/dictionary";
import { KnownLetter, LetterState } from "./types/letters";
import { ref } from "vue";
import {
  generateWordScores,
  getSuggestions,
  initialSuggestions,
} from "./utils/suggestions";

const invalidLetters = ref([] as string[]);
const knownLetters = ref([] as KnownLetter[]);
const guessResults = ref([] as LetterState[][]);
const suggestions = ref(initialSuggestions);

const onGuessSubmit = (letterStates: LetterState[]) => {
  const newState = getUpdatedGameState(
    invalidLetters.value,
    knownLetters.value,
    letterStates
  );
  knownLetters.value = newState.knownLetters;
  invalidLetters.value = newState.invalidLetters;
  suggestions.value = getSuggestions(
    wordList,
    knownLetters.value,
    invalidLetters.value
  );
  guessResults.value = [...guessResults.value, [...letterStates]];
};

const onReset = () => {
  invalidLetters.value = [];
  knownLetters.value = [];
  guessResults.value = [];
  suggestions.value = initialSuggestions;
};
</script>

<template>
  <h1 class="mb-8">Wordle Solver</h1>
  <ol v-if="guessResults.length" class="mb-8">
    <li v-for="(result, index) in guessResults" :key="index">
      <GuessResult :result="result" :number="index + 1" />
    </li>
  </ol>
  <div v-if="suggestions.length > 1">
    <GuessInput :known-letters="knownLetters" @guess-submit="onGuessSubmit" />
    <Suggestions :suggestions="suggestions" />
  </div>
  <div v-else-if="suggestions.length === 1">
    <p class="mb-4">Yay! Today's word is {{ suggestions[0] }}.</p>
    <button class="default-button" @click="onReset">Start Again</button>
  </div>
  <div v-else>
    <p class="mb-4">
      Oops! There are no possible words remaining, check your inputs and try
      again.
    </p>
    <button class="default-button" @click="onReset">Reset</button>
  </div>
</template>

<style></style>
