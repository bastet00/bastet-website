export interface Language {
  text: string;
  query: string;
}

export interface ArabicWord {
  Word: string;
  Symbol: string;
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

export interface SerializedRes {
  to: ArabicWord[] | EgyptianWord[];
  from: ArabicWord[] | EgyptianWord[];
}
