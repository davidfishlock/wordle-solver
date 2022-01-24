import { CONSONANTS, VOWELS, EXACT_MATCH_MULTIPLIER } from "../constants";
import { Guess } from "../types/types";
import { wordList } from "../data/dictionary";

const startingPositionInfo = {
  totalCount: 0,
  positionCounts: [0, 0, 0, 0, 0],
};

type LetterPositionInfo = typeof startingPositionInfo;

type WordScore = {
  word: string;
  score: number;
};

export const initialSuggestions = getSuggestions(wordList, []);

function generateLetterScores(words: string[]) {
  const scores: Record<string, LetterPositionInfo> = {
    ...[...VOWELS, ...CONSONANTS].reduce(
      (acc, char) => ({
        ...acc,
        [char]: { ...startingPositionInfo },
      }),
      {}
    ),
  };

  words.forEach((word) => {
    const chars = word.split("");
    chars.forEach((char, index) => {
      scores[char].totalCount++;
      scores[char].positionCounts[index]++;
    });
  });

  return scores;
}

export function generateWordScores(words: string[]): WordScore[] {
  const letterScores = generateLetterScores(words);

  const wordScores = words.map((word) => {
    const chars = word.split("");
    const unique = [...new Set(chars)].length;
    const score =
      word.split("").reduce((acc, char, index) => {
        const letterValue =
          letterScores[char].totalCount +
          letterScores[char].positionCounts[index] * EXACT_MATCH_MULTIPLIER;
        return acc + letterValue;
      }, 0) * unique;

    return { word, score };
  });

  return wordScores;
}

function isValidForGuess(word: string, guess: Guess) {
  for (const [index, letterState] of guess.entries()) {
    if (letterState.state === "match" && word[index] !== letterState.letter) {
      return false;
    }

    const indicatedCharacterInstancesInGuess = guess.filter(
      (state) =>
        state.letter === letterState.letter && state.state !== "invalid"
    ).length;
    const characterInstancesInWord = word
      .split("")
      .filter((letter) => letter === letterState.letter).length;

    if (
      letterState.state === "partial" &&
      (word[index] === letterState.letter ||
        characterInstancesInWord < indicatedCharacterInstancesInGuess)
    ) {
      return false;
    }

    if (
      letterState.state === "invalid" &&
      (word[index] === letterState.letter ||
        characterInstancesInWord > indicatedCharacterInstancesInGuess)
    ) {
      return false;
    }
  }

  return true;
}

export function getSuggestions(remainingWords: string[], guesses: Guess[]) {
  const candidates = remainingWords.filter((word) =>
    guesses.every((guess) => isValidForGuess(word, guess))
  );

  return generateWordScores(candidates)
    .sort((a, b) => b.score - a.score)
    .map((wordScore) => wordScore.word);
}
