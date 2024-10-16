export interface Word {
  id: string;
  arabic: { word: string }[];
  egyptian: {
    word: string;
    symbol: string;
    transliteration: string;
    hieroglyphics: string[];
  }[];
  english: { word: string }[];
}

export type WordList = Word[];
