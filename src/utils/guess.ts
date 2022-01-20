import { KnownLetter, LetterState } from "../types/letters";

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
      (letter) => letter.char === item.letter
    );

    if (!existingKnownLetter) {
      updatedKnownLetters = [
        ...updatedKnownLetters,
        {
          char: item.letter,
          matches: item.state === "match" ? [index] : [],
          partials: item.state === "partial" ? [index] : [],
        },
      ];
    }

    if (existingKnownLetter) {
      const existingIndex = updatedKnownLetters.findIndex(
        (letter) => letter.char === item.letter
      );
      updatedKnownLetters = [
        ...updatedKnownLetters.slice(0, existingIndex),
        {
          char: item.letter,
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

export function getPossibleWords(
  dictionary: string[],
  knownCharacters: KnownLetter[],
  invalidLetters: string[]
) {
  const withoutInvalidChars = dictionary.filter((word) =>
    word
      .split("")
      .every(
        (letter) =>
          !invalidLetters.includes(letter) ||
          knownCharacters.some((char) => char.char === letter)
      )
  );
  const withKnownCharacters = withoutInvalidChars.filter((word) =>
    knownCharacters.every(
      (knownChar) =>
        word.split("").includes(knownChar.char) &&
        knownChar.matches.every((index) => word[index] === knownChar.char) &&
        knownChar.partials.every((index) => word[index] !== knownChar.char)
    )
  );

  return withKnownCharacters;
}
