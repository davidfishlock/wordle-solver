import { Guess, KnownLetter } from "../types/types";
import { getSuggestions, initialSuggestions } from "../utils/suggestions";
import { wordList } from "../data/dictionary";
import { getUpdatedGameState } from "../utils/guess";

const MAX_GUESSES = 6;

function isExactMatch(targetWord: string, guessWord: string, index: number) {
  return guessWord[index] === targetWord[index];
}

function getGuessResult(targetWord: string, guessWord: string): Guess {
  // Initialize and apply exact matches
  const initialStates: Guess = [
    {
      letter: guessWord[0],
      state: isExactMatch(targetWord, guessWord, 0) ? "match" : "invalid",
    },
    {
      letter: guessWord[1],
      state: isExactMatch(targetWord, guessWord, 1) ? "match" : "invalid",
    },
    {
      letter: guessWord[2],
      state: isExactMatch(targetWord, guessWord, 2) ? "match" : "invalid",
    },
    {
      letter: guessWord[3],
      state: isExactMatch(targetWord, guessWord, 3) ? "match" : "invalid",
    },
    {
      letter: guessWord[4],
      state: isExactMatch(targetWord, guessWord, 4) ? "match" : "invalid",
    },
  ];

  // calculate any partial matches
  const result = initialStates.map((letterState) => {
    if (letterState.state === "invalid") {
      const hasPartialCharacterMatches =
        targetWord
          .split("")
          .filter(
            (char, index) =>
              char === letterState.letter &&
              initialStates[index].state !== "match"
          ).length > 0;

      return hasPartialCharacterMatches
        ? ({ ...letterState, state: "partial" } as const)
        : letterState;
    }
    return letterState;
  });

  return result;
}

type GameScore = 1 | 2 | 3 | 4 | 5 | 6;

function simulateGame(targetWord: string) {
  let guessCount = 0;
  let invalidLetters = [] as string[];
  let knownLetters = [] as KnownLetter[];
  let suggestions = initialSuggestions;

  for (let x = 0; x < MAX_GUESSES; x++) {
    guessCount++;

    const guessResult = getGuessResult(targetWord, suggestions[0]);
    const newState = getUpdatedGameState(
      invalidLetters,
      knownLetters,
      guessResult
    );

    invalidLetters = newState.invalidLetters;
    knownLetters = newState.knownLetters;

    suggestions = getSuggestions(wordList, knownLetters, invalidLetters);

    if (suggestions.length === 1) {
      break;
    }
  }

  return guessCount as GameScore;
}

describe("simulation", () => {
  test("simulate all possible games", () => {
    const results = wordList.map((word) => ({
      word,
      score: simulateGame(word),
    }));
    const totalsSummary = results.reduce(
      (acc, result) => ({
        ...acc,
        total: acc.total + result.score,
        [result.score]: acc[result.score] + 1,
      }),
      { total: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    );
    console.log("Summary:", totalsSummary);
    console.log("All results:", results);
  });
});
