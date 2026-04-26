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
  transliteration?: string;
  hieroglyphics?: string[];
  hieroglyphicSigns?: string[];
}

export interface TranslationRes {
  id: string;
  arabic: ArabicWord[];
  egyptian: EgyptianWord[];
  english: EnglishWord[];
  category?: string[];
}

export interface TranslationResToView {
  id: string;
  arabic: string;
  egyptian: string;
  english?: string;
  hieroglyphics?: string;
  transliteration?: string;
  resources?: string;
  hieroglyphicSigns?: string;
  category?: string[];
}
