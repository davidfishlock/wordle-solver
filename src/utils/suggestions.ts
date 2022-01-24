import {
  CONSONANTS,
  MAX_SUGGESTIONS_LENGTH,
  VOWELS,
  EXACT_MATCH_MULTIPLIER,
} from "../constants";
import { KnownLetter } from "../types/types";
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

export const initialSuggestions = getSuggestions(wordList, [], []);

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

function getTopScoringSuggestions(words: string[]) {
  return generateWordScores(words)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SUGGESTIONS_LENGTH)
    .map((wordScore) => wordScore.word);
}

export function getSuggestions(
  dictionary: string[],
  knownLetters: KnownLetter[],
  invalidLetters: string[]
) {
  const withoutInvalidLetters = dictionary.filter((word) =>
    word
      .split("")
      .every(
        (letter) =>
          !invalidLetters.includes(letter) ||
          knownLetters.some((knownLetter) => knownLetter.letter === letter)
      )
  );
  const withKnownLetters = withoutInvalidLetters.filter((word) =>
    knownLetters.every((knownLetter) => {
      const normalizedChar = knownLetter.letter;
      return (
        word.split("").includes(normalizedChar) &&
        knownLetter.matches.every((index) => word[index] === normalizedChar) &&
        knownLetter.partials.every((index) => word[index] !== normalizedChar)
      );
    })
  );

  return getTopScoringSuggestions(withKnownLetters);
}
