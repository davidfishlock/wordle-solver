import { Guess } from "../types/types";
import { getSuggestions, initialSuggestions } from "../utils/suggestions";
import { wordList } from "../data/dictionary";

const MAX_GUESSES = 7;

function getGuessResult(targetWord: string, guessWord: string): Guess {
  function isExactMatch(targetWord: string, guessWord: string, index: number) {
    return guessWord[index] === targetWord[index];
  }

  // Initialize and apply exact matches
  const states: Guess = [
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
  const result = states.reduce((acc, current, index) => {
    if (current.state === "match") return acc;
    if (!targetWord.includes(current.letter)) return acc;

    const totalInstancesInWord = targetWord
      .split("")
      .filter((char) => char === current.letter).length;
    const foundInstances = acc.filter(
      (letterState) =>
        letterState.letter === current.letter && letterState.state != "invalid"
    ).length;

    return foundInstances < totalInstancesInWord
      ? [
          ...acc.slice(0, index),
          { ...current, state: "partial" } as const,
          ...acc.slice(index + 1, acc.length),
        ]
      : acc;
  }, states);

  return result;
}

type GameScore = 1 | 2 | 3 | 4 | 5 | 6 | 7;

function simulateGame(targetWord: string) {
  let guesses = [] as Guess[];
  let suggestions = initialSuggestions;

  while (guesses.length < MAX_GUESSES) {
    const guess = getGuessResult(targetWord, suggestions[0]);
    guesses = [...guesses, guess];
    suggestions = getSuggestions(suggestions, guesses);

    if (suggestions.length === 1) {
      break;
    }

    if (suggestions.length === 0) {
      throw new Error(
        `Simulation failed for word: ${targetWord} on guess number ${guesses.length}. No suggestions found.`
      );
    }

    if (guesses.length === MAX_GUESSES) {
      throw new Error(
        `Simulation failed for word: ${targetWord}. Exceeding max guesses.`
      );
    }
  }

  return guesses.length as GameScore;
}

describe("simulation", () => {
  test("simulate all possible games", () => {
    const t0 = performance.now();
    const results = wordList.map((word) => ({
      word,
      score: simulateGame(word),
    }));
    const summary = results.reduce(
      (acc, result) => ({
        ...acc,
        total: acc.total + result.score,
        [result.score]: acc[result.score] + 1,
      }),
      { total: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 }
    );
    const t1 = performance.now();
    console.log("Summary:", summary);
    console.log("Duration:", t1 - t0);
  });
});
