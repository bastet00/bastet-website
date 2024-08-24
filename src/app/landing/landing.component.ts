import { Component } from '@angular/core';
import {
  ArabicWord,
  EgyptianWord,
  Language,
  TranslationRes,
} from './interface';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  private url = 'http://localhost:3000';

  languages: Language[] = [
    { text: 'عربي', query: 'Arabic' },
    { text: 'هيروغليفي', query: 'Egyptian' },
  ];

  onClick(): void {
    let stash = {} as Language;
    stash = this.languages[0];
    this.languages[0] = this.languages[1];
    this.languages[1] = stash;
  }

  async onChange(word: string): Promise<void> {
    const transFrom = this.languages[0].query;
    const transTo = this.languages[1].query;
    const translateToBox = document.getElementById('trans-to')
      ?.children[0] as HTMLTextAreaElement;
    if (word) {
      const call = await fetch(`${this.url}?lang=${transFrom}&word=${word}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res: TranslationRes[] = await call.json();
      if (call.ok && Boolean(res.length)) {
        const test1 = res
          .map(
            (res) =>
              res[transTo as keyof TranslationRes] as
                | ArabicWord[]
                | EgyptianWord[],
          )[0]
          .map((words) => words.Word);
        translateToBox.classList.remove('hidden');
        translateToBox.value = `${test1.join('')}`;
      }
    }
  }
}
