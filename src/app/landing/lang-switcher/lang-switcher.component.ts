import { Component, OnInit } from '@angular/core';
import { Language } from '../interface';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [],
  templateUrl: './lang-switcher.component.html',
  styleUrl: './lang-switcher.component.scss',
})
export class LangSwitcherComponent implements OnInit {
  localKey: string = 'selectedLanguages';

  languages: Language[] = [
    { text: 'هيروغليفي', query: 'Arabic' },
    { text: 'عربي', query: 'Egyptian' },
  ];

  ngOnInit(): void {
    this.loadLanguages();
  }

  loadLanguages(): void {
    const storedLanguages = window.localStorage.getItem(this.localKey);
    if (storedLanguages) {
      this.languages = JSON.parse(storedLanguages);
    }
  }

  updateLanguage(): void {
    window.localStorage.setItem(this.localKey, JSON.stringify(this.languages));
  }

  onClick(): void {
    let stash = {} as Language;
    stash = this.languages[0];
    this.languages[0] = this.languages[1];
    this.languages[1] = stash;
    this.updateLanguage();
  }
}
