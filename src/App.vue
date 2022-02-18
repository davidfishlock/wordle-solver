<script setup lang="ts">
import GuessInput from "./components/GuessInput.vue";
import GuessResult from "./components/GuessResult.vue";
import Suggestions from "./components/Suggestions.vue";
import Keyboard from "./components/Keyboard.vue";
import { MAX_SUGGESTIONS_LENGTH, WORD_LENGTH } from "./constants";
import { Guess } from "./types/types";
import { ref, watch } from "vue";
import {
  getKnownMatchState,
  getSuggestions,
  initialSuggestions,
} from "./utils/suggestions";
import { findLastIndex, replaceAt } from "./utils/array";

const getInitialGuessState = () => {
  return Array(WORD_LENGTH).fill({ letter: "", state: "invalid" });
};

const currentGuess = ref(getInitialGuessState() as Guess);
const lastFilledIndex = ref(-1);
const guesses = ref([] as Guess[]);
const suggestions = ref(initialSuggestions);

watch(
  currentGuess,
  (value) => {
    lastFilledIndex.value = findLastIndex(
      value,
      (entry) => entry.letter !== ""
    );
  },
  { deep: true }
);

function onAddLetter(letter: string) {
  const newLetterIndex = lastFilledIndex.value + 1;
  currentGuess.value = replaceAt(currentGuess.value, newLetterIndex, {
    ...currentGuess.value[newLetterIndex],
    letter,
    state: getKnownMatchState(guesses.value, letter, newLetterIndex),
  });
}

function onRemoveLetter() {
  const removedLetterIndex = lastFilledIndex.value;
  currentGuess.value = replaceAt(currentGuess.value, lastFilledIndex.value, {
    ...currentGuess.value[removedLetterIndex],
    letter: "",
    state: "invalid",
  });
}

function onGuessSubmit() {
  guesses.value = [...guesses.value, currentGuess.value];
  currentGuess.value = getInitialGuessState();
  suggestions.value = getSuggestions(suggestions.value, guesses.value);
}

function onSuggestionSelected(word: string) {
  currentGuess.value = [
    { letter: word[0], state: getKnownMatchState(guesses.value, word[0], 0) },
    { letter: word[1], state: getKnownMatchState(guesses.value, word[1], 1) },
    { letter: word[2], state: getKnownMatchState(guesses.value, word[2], 2) },
    { letter: word[3], state: getKnownMatchState(guesses.value, word[3], 3) },
    { letter: word[4], state: getKnownMatchState(guesses.value, word[4], 4) },
  ];
}

function onReset() {
  guesses.value = [];
  currentGuess.value = getInitialGuessState();
  suggestions.value = initialSuggestions;
}
</script>

<template>
  <div class="h-full mx-auto max-w-lg pt-6 sm:pt-8 pb-4 flex flex-col">
    <div class="flex-grow mx-6 sm:mx-8">
      <h1 class="mb-6 sm:mb-10">Wordle Solver</h1>
      <ol v-if="guesses.length" class="mb-6">
        <li v-for="(result, index) in guesses" :key="index">
          <GuessResult :result="result" :number="index + 1" />
        </li>
      </ol>
      <div v-if="suggestions.length > 1">
        <GuessInput
          v-model:guess="currentGuess"
          class="mb-6 sm:mb-10"
          @submit="onGuessSubmit"
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
    </div>
    <div class="mx-1">
      <Suggestions
        v-if="suggestions.length > 1"
        :suggestions="suggestions.slice(0, MAX_SUGGESTIONS_LENGTH)"
        @selected="onSuggestionSelected"
      />
      <Keyboard
        class="mt-4"
        :last-filled-index="lastFilledIndex"
        @add-letter="onAddLetter"
        @remove-letter="onRemoveLetter"
        @submit="onGuessSubmit"
      />
    </div>
  </div>
</template>

<style></style>
