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

export interface WordCardDto {
  id: string;
  arabic: string;
  egyptian: string;
  symbol: string;
  category?: string[];
}
export type WordList = Word[];

export function toSymbol(sy: string) {
  const symbol = '0x' + sy;
  const entity = parseInt(symbol, 16);
  return `&#${entity};`;
}

export function toWordCardDto(word: Word): WordCardDto {
  return {
    id: word.id,
    arabic: word.arabic.map((arabic) => arabic.word).join(', '),
    egyptian: word.egyptian[0].word,
    symbol: toSymbol(word.egyptian[0].symbol),
    category: word.category,
  };
}
