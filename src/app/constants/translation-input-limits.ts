/** Max characters accepted for search / translation requests (inclusive of spaces). */
export const MAX_TRANSLATION_INPUT_LENGTH = 200;

/** Shown when input exceeds `MAX_TRANSLATION_INPUT_LENGTH` (same pattern as other `notificationService.error` toasts). */
export const TRANSLATION_INPUT_OVER_LIMIT_MESSAGE =
  'الترجمة محدودة بـ ٢٠٠ حرف.';

/**
 * One dictionary token: no whitespace; multi-word / phrase input uses the sentence path.
 */
export function isSingleWordText(text: string): boolean {
  const t = text.trim();
  if (!t) {
    return false;
  }
  return t.split(/\s+/).length === 1;
}
