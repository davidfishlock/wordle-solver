<script setup lang="ts">
import GuessInput from "./components/GuessInput.vue";
import GuessResult from "./components/GuessResult.vue";
import { getPossibleWords, getUpdatedGameState } from "./utils/guess";
import { wordList } from "./data/dictionary";
import { KnownLetter, LetterState } from "./types/letters";
import { ref } from "vue";

const invalidLetters = ref([] as string[]);
const knownCharacters = ref([] as KnownLetter[]);
const guessResults = ref([] as LetterState[][]);
const possibleWords = ref(wordList);

const onGuessSubmit = (letterStates: LetterState[]) => {
  const newState = getUpdatedGameState(
    invalidLetters.value,
    knownCharacters.value,
    letterStates
  );
  knownCharacters.value = newState.knownLetters;
  invalidLetters.value = newState.invalidLetters;
  possibleWords.value = getPossibleWords(
    wordList,
    knownCharacters.value,
    invalidLetters.value
  );
  guessResults.value = [...guessResults.value, [...letterStates]];
};

const onReset = () => {
  console.log("on reset");
  invalidLetters.value = [];
  knownCharacters.value = [];
  guessResults.value = [];
  possibleWords.value = wordList;
};
</script>

<template>
  <h1>Wordle Solver</h1>

  <ol v-if="guessResults.length">
    <li v-for="(result, index) in guessResults" :key="index">
      <GuessResult :result="result" :number="index + 1" />
    </li>
  </ol>

  <div v-if="possibleWords.length">
    <GuessInput @guess-submit="onGuessSubmit" />

    <h2>Suggestions:</h2>
    <ol>
      <li v-for="(word, index) in possibleWords" :key="index">{{ word }}</li>
    </ol>
  </div>
  <div v-else>
    <p>
      Oops! There are no possible words remaining, check your inputs and try
      again.
    </p>
    <button @click="onReset">Reset</button>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.invalid {
  background: #3a3a3c;
}
.partial {
  background: #b59f3b;
}
.match {
  background: #538d4e;
}
</style>
