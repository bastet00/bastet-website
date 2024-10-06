export interface Word {
  id: string;
  arabic: { word: string }[];
  egyptian: { word: string; symbol: string }[];
  english: { word: string }[];
}

export type WordList = Word[];
