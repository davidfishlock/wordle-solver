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
          v-model="currentGuess"
          class="mb-6 sm:mb-10"
          @submit="appStore.submitGuess"
        />
      </div>
      <div v-else-if="suggestions.length === 1">
        <p class="mb-4">Yay! Today's word is {{ suggestions[0] }}.</p>
        <button class="default-button" @click="appStore.reset">
          Start Again
        </button>
      </div>
      <div v-else>
        <p class="mb-4">
          Oops! There are no possible words remaining, check your inputs and try
          again.
        </p>
        <button class="default-button" @click="appStore.reset">Reset</button>
      </div>
    </div>

    <div class="mx-1">
      <Suggestions
        v-if="suggestions.length > 1"
        :suggestions="suggestions.slice(0, MAX_SUGGESTIONS_LENGTH)"
        @selected="appStore.selectSuggestion"
      />
      <Keyboard
        class="mt-4"
        :current-word-input="currentWordInput"
        @add-letter="appStore.addLetter"
        @remove-letter="appStore.removeLetter"
        @submit="appStore.submitGuess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GuessInput from "./components/GuessInput.vue";
import GuessResult from "./components/GuessResult.vue";
import Suggestions from "./components/Suggestions.vue";
import Keyboard from "./components/Keyboard.vue";
import { MAX_SUGGESTIONS_LENGTH } from "./constants";
import { useAppStore } from "./store/appStore";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const { currentGuess, guesses, suggestions, currentWordInput } =
  storeToRefs(appStore);
</script>
