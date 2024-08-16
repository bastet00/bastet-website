export interface Word {
  id: string;
  Arabic: { Word: string }[];
  Egyptian: { Word: string; Symbol: string }[];
}

export type WordList = Word[];
