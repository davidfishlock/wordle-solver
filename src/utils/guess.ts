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
  const withoutInvalidChars = dictionary.filter((word) =>
    word
      .split("")
      .every(
        (letter) =>
          !invalidLetters.includes(letter) ||
          knownLetters.some((knownLetter) => knownLetter.letter.toLowerCase() === letter)
      )
  );
  const withKnownCharacters = withoutInvalidChars.filter((word) =>
    knownLetters.every(
      (knownLetter) => {
        const normalizedChar = knownLetter.letter.toLowerCase();
        return word.split("").includes(normalizedChar) &&
          knownLetter.matches.every((index) => word[index] === normalizedChar) &&
          knownLetter.partials.every((index) => word[index] !== normalizedChar)
      }
    )
  );

  return withKnownCharacters;
}
