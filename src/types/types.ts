export type MatchState = "invalid" | "partial" | "match";

export type KnownLetter = {
  letter: string;
  matches: number[];
  partials: number[];
};

export type LetterState = {
  letter: string;
  state: MatchState;
};

export type Guess = LetterState[];
