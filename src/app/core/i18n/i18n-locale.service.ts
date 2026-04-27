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
      this.applyToDocument(lang);
    });
    this.applyToDocument(this.transloco.getActiveLang());
  }

  setActiveLang(lang: AppLocale): void {
    this.transloco.setActiveLang(lang);
    localStorage.setItem(LOCALE_STORAGE_KEY, lang);
  }

  isArabicActive(): boolean {
    return this.transloco.getActiveLang() === 'ar';
  }

  private applyToDocument(lang: string): void {
    const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';
    const html = document.documentElement;
    html.setAttribute('dir', dir);
    html.setAttribute('lang', lang);
    document.body.setAttribute('dir', dir);
    this.title.setTitle(this.transloco.translate('app.htmlTitle'));
  }
}
