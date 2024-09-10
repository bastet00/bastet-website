import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Language, TranslationRes } from '../interface';
import { CommonModule } from '@angular/common';
import { translation } from '../utils';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss',
})
export class UserInputComponent implements OnInit {
  constructor(private languageService: LanguageService) {}

  private languages: Language[] = [];
  ngOnInit(): void {
    this.languageService.languages$.subscribe((lang) => {
      this.languages = lang;
    });
  }

  data = [] as TranslationRes[];

  loading: boolean = false;
  private handler: ReturnType<typeof setTimeout> | null = null;

  onChange(word: string): void {
    const delay = 300;

    if (this.handler) {
      clearTimeout(this.handler);
    }

    if (word.trim() !== '') {
      this.handler = setTimeout(() => {
        translation(this.languages[0].query, word).subscribe({
          next: (data: TranslationRes[]) => {
            this.data = data;
            console.log(this.data);
          },
        });
      }, delay);
    }
  }
}
