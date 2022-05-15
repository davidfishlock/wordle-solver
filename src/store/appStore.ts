import { defineStore } from "pinia";
import { WORD_LENGTH } from "../constants";
import { Guess, MatchState } from "../types/guess";
import { replaceAt } from "../utils/array";
import {
  getKnownMatchState,
  getSuggestions,
  initialSuggestions,
} from "../utils/suggestions";

export const useAppStore = defineStore("appStore", {
  state: () => {
    return {
      currentGuess: createNewGuess(),
      suggestions: initialSuggestions,
      guesses: [] as Guess[],
    };
  },

  getters: {
    currentWordInput: (state) =>
      state.currentGuess
        .filter((entry) => !!entry.letter)
        .map((entry) => entry.letter)
        .join(""),
  },

  actions: {
    submitGuess() {
      this.guesses.push(this.currentGuess);
      this.currentGuess = createNewGuess();
      this.suggestions = getSuggestions(this.suggestions, this.guesses);
    },
    selectSuggestion(suggestion: string) {
      this.currentGuess = [
        {
          letter: suggestion[0],
          state: getKnownMatchState(this.guesses, suggestion[0], 0),
        },
        {
          letter: suggestion[1],
          state: getKnownMatchState(this.guesses, suggestion[1], 1),
        },
        {
          letter: suggestion[2],
          state: getKnownMatchState(this.guesses, suggestion[2], 2),
        },
        {
          letter: suggestion[3],
          state: getKnownMatchState(this.guesses, suggestion[3], 3),
        },
        {
          letter: suggestion[4],
          state: getKnownMatchState(this.guesses, suggestion[4], 4),
        },
      ];
    },
    addLetter(letter: string) {
      const newLetterIndex = this.currentWordInput.length;
      this.currentGuess = replaceAt(this.currentGuess, newLetterIndex, {
        ...this.currentGuess[newLetterIndex],
        letter,
        state: getKnownMatchState(this.guesses, letter, newLetterIndex),
      });
    },
    removeLetter() {
      this.currentGuess = replaceAt(
        this.currentGuess,
        this.currentWordInput.length - 1,
        {
          ...this.currentGuess[this.currentWordInput.length - 1],
          letter: "",
          state: MatchState.Invalid,
        }
      );
    },
    reset() {
      this.guesses = [];
      this.currentGuess = createNewGuess();
      this.suggestions = initialSuggestions;
    },
  },
});

function createNewGuess(): Guess {
  return Array(WORD_LENGTH).fill({ letter: "", state: MatchState.Invalid });
}
