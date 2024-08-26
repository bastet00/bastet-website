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

export type OmitIDResponse = Omit<TranslationRes, 'id'>;

export interface RenameResponseKeys {
  to: ArabicWord[] | EgyptianWord[];
  from: ArabicWord[] | EgyptianWord[];
}
