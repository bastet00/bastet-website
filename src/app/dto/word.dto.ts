export interface Word {
  id: string;
  arabic: { word: string }[];
  egyptian: {
    word: string;
    transliteration: string;
    hieroglyphics: string[];
    hieroglyphicSigns: string[];
  }[];
  english: { word: string }[];
  resources: string[];
  category?: string[];
}

export interface WordCardDto {
  id: string;
  arabic: string;
  egyptian: string;
  category?: string[];
}
export type WordList = Word[];

export function toWordCardDto(word: Word): WordCardDto {
  return {
    id: word.id,
    arabic: word.arabic.map((arabic) => arabic.word).join(', '),
    egyptian: word.egyptian[0].word,
    category: word.category,
  };
}
