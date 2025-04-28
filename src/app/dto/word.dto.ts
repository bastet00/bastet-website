export interface Word {
  id: string;
  arabic: { word: string }[];
  egyptian: {
    word: string;
    symbol: string;
    transliteration: string;
    hieroglyphics: string[];
    hieroglyphicSigns: string[];
  }[];
  english: { word: string }[];
  resources: string[];
  category?: string[];
}

export type WordList = Word[];
