import { Component } from '@angular/core';
import { StaticComponent } from './static/static.component';
import { LangSwitcherComponent } from './lang-switcher/lang-switcher.component';
import { UserInputComponent } from './user-input/user-input.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [StaticComponent, LangSwitcherComponent, UserInputComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  // textGenerator(arrOfWords: ArabicWord[], symbol?: string): string {
  //   const text = arrOfWords.map((words) => words.Word);
  //   if (symbol) {
  //     return text.join(' , ') + symbolTranslator(symbol);
  //   } else {
  //     return text.join(' , ');
  //   }
  // }
  // isToEgy(obj: RenameResponseKeys) {
  //   const result = document.getElementById(
  //     'trans-result',
  //   ) as HTMLParagraphElement;
  //   const match = document.getElementById(
  //     'trans-match',
  //   ) as HTMLParagraphElement;
  //
  //   if (this.languages[0].query === 'Egyptian') {
  //     result.classList.add('translation-to-egy-text');
  //     match.classList.remove('translation-to-egy-text');
  //     result.innerHTML = this.textGenerator(
  //       obj.to,
  //       (obj.to[0] as EgyptianWord).Symbol,
  //     );
  //     match.innerHTML = this.textGenerator(obj.from);
  //   } else {
  //     result.classList.remove('translation-to-egy-text');
  //     match.classList.add('translation-to-egy-text');
  //     result.innerHTML = this.textGenerator(obj.to);
  //     match.innerHTML = this.textGenerator(
  //       obj.from,
  //       (obj.from[0] as EgyptianWord).Symbol,
  //     );
  //   }
  // }
  //
  // private hanlder: ReturnType<typeof setTimeout> | null = null;
  // loading: boolean = false;
  //
  // async onChange(word: string): Promise<void> {
  //   const delay: number = 300;
  //
  //   if (this.hanlder) {
  //     clearTimeout(this.hanlder);
  //   }
  //
  //   if (word.trim() !== '') {
  //     this.loading = true;
  //     controllDisplay(false);
  //     this.hanlder = setTimeout(async () => {
  //       const data = await translation(
  //         this.languages[0].query,
  //         this.languages[1].query,
  //         word,
  //       );
  //
  //       if (data) {
  //         this.isToEgy(data);
  //       } else {
  //         controllDisplay(false);
  //       }
  //       this.loading = false;
  //     }, delay);
  //   } else {
  //     controllDisplay(false);
  //   }
  // }
}
