import { Injectable } from '@angular/core';
import { Language } from '../landing/interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private localKey: string = 'Lang';
  private languageTrace: BehaviorSubject<Language[]> = new BehaviorSubject([
    { text: 'هيروغليفي', query: 'Arabic' },
    { text: 'عربي', query: 'Egyptian' },
  ]);
  constructor() {
    this.LoadLanguage();
  }

  languages$ = this.languageTrace.asObservable();

  private LoadLanguage(): void {
    const storedLanguages = window.localStorage.getItem(this.localKey);
    if (storedLanguages) {
      const parse = JSON.parse(storedLanguages);
      this.languageTrace.next(parse);
    }
  }

  getLanguages(): Language[] {
    return this.languageTrace.getValue();
  }

  updateLanguage(): void {
    const currentLanguages = this.languageTrace.getValue();
    window.localStorage.setItem(
      this.localKey,
      JSON.stringify(currentLanguages),
    );
    this.languageTrace.next(currentLanguages);
  }

  swapLanguages(): void {
    const current = this.languageTrace.getValue();
    let stash = {} as Language;
    stash = current[0];
    current[0] = current[1];
    current[1] = stash;
    this.updateLanguage();
  }
}
