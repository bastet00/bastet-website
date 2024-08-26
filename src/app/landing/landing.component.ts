import { Component, OnInit } from '@angular/core';
import {
  ArabicWord,
  EgyptianWord,
  Language,
  RenameResponseKeys,
} from './interface';
import { controllDisplay, symbolTranslator, translation } from './utils';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  localKey: string = 'selectedLanguages';

  languages: Language[] = [
    { text: 'هيروغليفي', query: 'Egyptian' },
    { text: 'عربي', query: 'Arabic' },
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
    controllDisplay(false);
    let stash = {} as Language;
    stash = this.languages[0];
    this.languages[0] = this.languages[1];
    this.languages[1] = stash;
    this.updateLanguage();
  }

  textGenerator(arrOfWords: ArabicWord[], symbol?: string): string {
    const text = arrOfWords.map((words) => words.Word);
    if (symbol) {
      return text.join(' , ') + symbolTranslator(symbol);
    } else {
      return text.join(' , ');
    }
  }

  isToEgy(obj: RenameResponseKeys) {
    const result = document.getElementById(
      'trans-result',
    ) as HTMLParagraphElement;
    const match = document.getElementById(
      'trans-match',
    ) as HTMLParagraphElement;

    if (this.languages[0].query === 'Egyptian') {
      result.classList.add('translation-to-egy-text');
      result.innerHTML = this.textGenerator(
        obj.to,
        (obj.to[0] as EgyptianWord).Symbol,
      );
      match.innerHTML = this.textGenerator(obj.from);
    } else {
      result.classList.remove('translation-to-egy-text');
      match.classList.add('translation-to-egy-text');
      result.innerHTML = this.textGenerator(obj.to);
      match.innerHTML = this.textGenerator(obj.from);
    }
  }

  private hanlder: ReturnType<typeof setTimeout> | null = null;

  async onChange(word: string): Promise<void> {
    const delay: number = 300;

    if (this.hanlder) {
      clearTimeout(this.hanlder);
    }

    if (word.trim() !== '') {
      this.hanlder = setTimeout(async () => {
        const data = await translation(
          this.languages[0].query,
          this.languages[1].query,
          word,
        );

        if (data) {
          this.isToEgy(data);
        } else {
          controllDisplay(false);
        }
      }, delay);
    } else {
      controllDisplay(false);
    }
  }
}
