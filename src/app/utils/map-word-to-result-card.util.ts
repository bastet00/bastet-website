import { TranslationResToView } from '../pages/home/landing/interface';

/**
 * API word shape (search, category, single-word) for card display in `app-translation-result`.
 */
export type WordLikeForResultCard = {
  id: string;
  arabic: { word: string }[];
  egyptian: {
    word: string;
    transliteration?: string;
    hieroglyphicSigns?: string[];
  }[];
  english?: { word: string }[];
  category?: string[];
};

/**
 * English UI → English gloss + transliteration; Arabic → Arabic + Egyptian (dictionary) form.
 * Same data as landing similar-word cards; pass `transloco.getActiveLang()`.
 */
export function mapWordToResultCard(
  word: WordLikeForResultCard,
  translocoActiveLang: string,
): TranslationResToView {
  const e0 = word.egyptian[0];
  if (!e0) {
    return { id: word.id, arabic: '', egyptian: '' };
  }
  const tr = (e0.transliteration?.trim() || e0.word) as string;
  if (translocoActiveLang === 'en') {
    const englishLine =
      word.english?.length && word.english[0]
        ? word.english.map((e) => e.word).join(', ')
        : word.arabic.map((a) => a.word).join(', ');
    return {
      id: word.id,
      arabic: englishLine,
      egyptian: tr,
      category: word.category,
      hieroglyphicSigns: e0.hieroglyphicSigns?.join(' '),
    };
  }
  return {
    id: word.id,
    arabic: word.arabic.map((a) => a.word).join(', '),
    egyptian: e0.word,
    category: word.category,
    hieroglyphicSigns: e0.hieroglyphicSigns?.join(' '),
  };
}
