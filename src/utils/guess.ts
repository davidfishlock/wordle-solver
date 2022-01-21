import { KnownLetter, LetterState, MatchState } from "../types/letters";

const VOWELS = ["a", "e", "i", "o", "u"];
const VOWEL_SCORE = 10;
const CONSONANT_SCORE = 5;
const MAX_SUGGESTIONS_LENGTH = 10;

function isVowel(letter: string) {
  return VOWELS.some((vowel) => vowel === letter);
}

function isKnownLetter(letter: string, knownLetters: KnownLetter[]) {
  return knownLetters.some((knownLetter) => knownLetter.letter === letter);
}

export function getKnownMatchState(
  letter: string,
  knownLetters: KnownLetter[],
  index: number
): MatchState {
  const knownEntry = knownLetters.find(
    (knownLetter) => knownLetter.letter === letter
  );

  if (!knownEntry) {
    return "invalid";
  }

  if (knownEntry.matches.some((matchIndex) => matchIndex === index)) {
    return "match";
  }

  if (knownEntry.partials.some((matchIndex) => matchIndex === index)) {
    return "partial";
  }

  return "invalid";
}

function getSuggestionScore(
  word: string,
  knownLetters: KnownLetter[]
) {
  const characters = word.split("");
  const uniqueRemainingVowels = [
    ...new Set(
      characters.filter(
        (character) =>
          isVowel(character) && !isKnownLetter(character, knownLetters)
      )
    ),
  ];
  const uniqueRemainingConsonants = [
    ...new Set(
      characters.filter(
        (character) =>
          !isVowel(character) && !isKnownLetter(character, knownLetters)
      )
    ),
  ];

  return (
    uniqueRemainingVowels.length * VOWEL_SCORE +
    uniqueRemainingConsonants.length * CONSONANT_SCORE
  );
}

export function getTopScoringSuggestions(
  words: string[],
  knownLetters: KnownLetter[]
) {
  return words
    .map((word) => ({
      word: word,
      score: getSuggestionScore(word, knownLetters),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SUGGESTIONS_LENGTH)
    .map((wordWithScore) => wordWithScore.word);
}

export function getUpdatedGameState(
  invalidLetters: string[],
  knownLetters: KnownLetter[],
  newLetterStates: LetterState[]
) {
  let updatedInvalidLetters = [...invalidLetters];
  let updatedKnownLetters = [...knownLetters];

  newLetterStates.forEach((item, index) => {
    if (item.state === "invalid") {
      updatedInvalidLetters = [
        ...new Set([...updatedInvalidLetters, item.letter]),
      ];
      return;
    }

    const existingKnownLetter = updatedKnownLetters.find(
      (letter) => letter.letter === item.letter
    );

    if (!existingKnownLetter) {
      updatedKnownLetters = [
        ...updatedKnownLetters,
        {
          letter: item.letter,
          matches: item.state === "match" ? [index] : [],
          partials: item.state === "partial" ? [index] : [],
        },
      ];
    }

    if (existingKnownLetter) {
      const existingIndex = updatedKnownLetters.findIndex(
        (letter) => letter.letter === item.letter
      );
      updatedKnownLetters = [
        ...updatedKnownLetters.slice(0, existingIndex),
        {
          letter: item.letter,
          matches:
            item.state === "match"
              ? [...new Set([...existingKnownLetter.matches, index])]
              : existingKnownLetter.matches,
          partials:
            item.state === "partial"
              ? [...new Set([...existingKnownLetter.partials, index])]
              : existingKnownLetter.partials,
        },
        ...updatedKnownLetters.slice(
          existingIndex + 1,
          updatedKnownLetters.length
        ),
      ];
    }
  });

  return {
    invalidLetters: updatedInvalidLetters,
    knownLetters: updatedKnownLetters,
  };
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
          knownLetters.some(
            (knownLetter) => knownLetter.letter === letter
          )
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

  return getTopScoringSuggestions(withKnownLetters, knownLetters);
}
