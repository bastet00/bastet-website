export interface Language {
  text: string;
  query: string;
}

export interface ArabicWord {
  word: string;
}

export type EnglishWord = ArabicWord;

export interface EgyptianWord {
  word: string;
  symbol: string;
}

export interface TranslationRes {
  id: string;
  arabic: ArabicWord[];
  egyptian: EgyptianWord[];
  english: EnglishWord[];
}

export interface TranslationResToView {
  id: string;
  arabic: string;
  egyptian: string;
  english?: string;
  symbol: string;
  hexSym?: string;
  hieroglyphics?: string;
  transliteration?: string;
  resources?: string;
}
