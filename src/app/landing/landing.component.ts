import { Component } from '@angular/core';
import { Language, SerializedRes } from './interface';
import { controllDisplay, generateText, translation } from './utils';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  languages: Language[] = [
    { text: 'هيروغليفي', query: 'Egyptian' },
    { text: 'عربي', query: 'Arabic' },
  ];

  onClick(): void {
    controllDisplay(false);
    let stash = {} as Language;
    stash = this.languages[0];
    this.languages[0] = this.languages[1];
    this.languages[1] = stash;
  }

  private hanlder: ReturnType<typeof setTimeout> | null = null;

  appendTranslation(data: SerializedRes | null): void {
    const translationTo = document.getElementById(
      'trans-result',
    ) as HTMLParagraphElement;
    const translationMatch = document.getElementById(
      'trans-match',
    ) as HTMLParagraphElement;

    if (data) {
      // user call was about translation to Egyptian so there might be symbol shown
      if (this.languages[0].query === 'Egyptian') {
        translationTo.innerHTML = generateText(data.to, true);
        translationMatch.innerHTML = generateText(data.from);
        return;
      }
      translationTo.innerHTML = generateText(data.to);
      translationMatch.innerHTML = generateText(data.from);
      return;
    }
  }

  async onChange(word: string): Promise<void> {
    // if user doesn't type for ${delay} millseconds call is excuted
    const delay: number = 300;

    if (this.hanlder) {
      clearTimeout(this.hanlder);
    }

    if (word.trim() !== '') {
      this.hanlder = setTimeout(async () => {
        const data = await translation(
          this.languages[1].query,
          this.languages[0].query,
          word,
        );
        this.appendTranslation(data);
      }, delay);
    } else {
      controllDisplay(false);
    }
  }
}
