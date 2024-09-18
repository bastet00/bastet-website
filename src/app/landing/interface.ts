export interface Language {
  text: string;
  query: string;
}

export interface ArabicWord {
  Word: string;
}
export type EnglishWord = ArabicWord

export interface EgyptianWord {
  Word: string;
  Symbol: string;
}

export interface TranslationRes {
  id: string;
  Arabic: ArabicWord[];
  Egyptian: EgyptianWord[];
  English: EnglishWord[];
}

export interface TranslationResToView {
  id: string;
  Arabic: string;
  Egyptian: string;
  English?: string;
  Symbol: string;
}
