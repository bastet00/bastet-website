export interface Language {
  text: string;
  query: string;
}

export interface ArabicWord {
  Word: string;
}

export interface EgyptianWord {
  Word: string;
  Symbol: string;
}

export interface TranslationRes {
  id: string;
  Arabic: ArabicWord[];
  Egyptian: EgyptianWord[];
}

export interface TranslationResToView {
  id: string;
  Arabic: string;
  Egyptian: string;
  Symbol: string;
}
