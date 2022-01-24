export type MatchState = "invalid" | "partial" | "match";

export type LetterState = {
  letter: string;
  state: MatchState;
};

export type Guess = LetterState[];
