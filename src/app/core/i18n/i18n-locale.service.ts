import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';

export const LOCALE_STORAGE_KEY = 'bastet-locale';
export type AppLocale = 'ar' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nLocaleService {
  private readonly transloco = inject(TranslocoService);
  private readonly title = inject(Title);

  constructor() {
    const fromStorage = localStorage.getItem(
      LOCALE_STORAGE_KEY,
    ) as AppLocale | null;
    if (fromStorage === 'en' || fromStorage === 'ar') {
      this.transloco.setActiveLang(fromStorage);
    }
    this.transloco.langChanges$.subscribe((lang) => {
      this.applyBidiToDocument(lang);
    });
    this.applyBidiToDocument(this.transloco.getActiveLang());
    // `translate()` in ctor runs before lazy-loaded JSON; `selectTranslate` updates when ready + on lang change
    this.transloco.selectTranslate<string>('app.htmlTitle').subscribe((t) => {
      this.title.setTitle(t);
    });
  }

  setActiveLang(lang: AppLocale): void {
    this.transloco.setActiveLang(lang);
    localStorage.setItem(LOCALE_STORAGE_KEY, lang);
  }

  isArabicActive(): boolean {
    return this.transloco.getActiveLang() === 'ar';
  }

  private applyBidiToDocument(lang: string): void {
    const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';
    const html = document.documentElement;
    html.setAttribute('dir', dir);
    html.setAttribute('lang', lang);
    document.body.setAttribute('dir', dir);
  }
}
