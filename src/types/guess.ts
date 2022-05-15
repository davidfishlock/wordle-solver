export enum MatchState {
  Invalid,
  Partial,
  Match,
}

export type LetterState = {
  letter: string;
  state: MatchState;
};

export type Guess = LetterState[];
