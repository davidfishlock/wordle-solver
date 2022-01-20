export type MatchState = "invalid" | "partial" | "match";

export type KnownLetter = {
  char: string;
  matches: number[];
  partials: number[];
};

export type LetterState = {
  letter: string;
  state: MatchState;
};
