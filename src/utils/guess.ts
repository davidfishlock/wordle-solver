import { KnownLetter, LetterState, MatchState } from "../types/letters";

export function getKnownMatchState(
  letter: string,
  knownLetters: KnownLetter[],
  index: number
): MatchState {
  const knownEntry = knownLetters.find(
    (knownLetter) => knownLetter.letter.toLowerCase() === letter.toLowerCase()
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
