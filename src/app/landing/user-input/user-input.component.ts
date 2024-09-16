/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Language } from '../interface';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss',
})
export class UserInputComponent implements OnInit {
  translationText: string = '';
  constructor(
    private languageService: LanguageService,
    private translationService: TranslationService,
  ) {}

  private languages: Language[] = [];

  ngOnInit(): void {
    this.languageService.languages$.subscribe((lang) => {
      this.languages = lang;
    });
  }

  loading: boolean = false;
  private handler: ReturnType<typeof setTimeout> | null = null;

  onChange(event: unknown, options: { delay?: number } = { delay: 300 }): void {
    // console.log(this.translationText, event);
    const { delay } = options;

    if (this.handler) {
      clearTimeout(this.handler);
    }

    if (this.translationText.trim() !== '') {
      this.handler = setTimeout(() => {
        this.translationService
          .translation(this.languages[0].query, this.translationText)
          .subscribe();
      }, delay);
    } else {
      this.translationService.setNull();
    }
  }

  addText(text: string) {
    this.translationText = text;
    this.onChange(text, { delay: 0 });
  }
}
