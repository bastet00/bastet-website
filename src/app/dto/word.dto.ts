export interface Word {
  id: string;
  arabic: { word: string }[];
  egyptian: { word: string; symbol: string }[];
}

export type WordList = Word[];
