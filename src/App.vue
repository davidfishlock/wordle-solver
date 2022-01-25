<script setup lang="ts">
import GuessInput from "./components/GuessInput.vue";
import GuessResult from "./components/GuessResult.vue";
import Suggestions from "./components/Suggestions.vue";
import { MAX_SUGGESTIONS_LENGTH, WORD_LENGTH } from "./constants";
import { Guess } from "./types/types";
import { ref } from "vue";
import { getSuggestions, initialSuggestions } from "./utils/suggestions";

const getInitialGuessState = () => {
  return Array(WORD_LENGTH).fill({ letter: "", state: "invalid" });
};

const currentGuess = ref(getInitialGuessState());
const guesses = ref([] as Guess[]);
const suggestions = ref(initialSuggestions);

const onGuessSubmit = (guess: Guess) => {
  guesses.value = [...guesses.value, guess];
  currentGuess.value = getInitialGuessState();
  suggestions.value = getSuggestions(suggestions.value, guesses.value);
};

const onSuggestionSelected = (word: string) => {
  currentGuess.value = [
    { letter: word[0], state: "invalid" },
    { letter: word[1], state: "invalid" },
    { letter: word[2], state: "invalid" },
    { letter: word[3], state: "invalid" },
    { letter: word[4], state: "invalid" },
  ];
};

const onReset = () => {
  guesses.value = [];
  currentGuess.value = getInitialGuessState();
  suggestions.value = initialSuggestions;
};
</script>

<template>
  <h1 class="mb-8">Wordle Solver</h1>
  <ol v-if="guesses.length" class="mb-8">
    <li v-for="(result, index) in guesses" :key="index">
      <GuessResult :result="result" :number="index + 1" />
    </li>
  </ol>
  <div v-if="suggestions.length > 1">
    <GuessInput v-model:guess="currentGuess" @submit="onGuessSubmit" />
    <Suggestions
      :suggestions="suggestions.slice(0, MAX_SUGGESTIONS_LENGTH)"
      @selected="onSuggestionSelected"
    />
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
