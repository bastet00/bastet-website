import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Language } from '../interface';
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

  loading: boolean = false;
  private handler: ReturnType<typeof setTimeout> | null = null;

  onChange(word: string): void {
    const delay = 300;
    if (this.handler) {
      clearTimeout(this.handler);
    }

    if (word.trim() !== '') {
      this.handler = setTimeout(async () => {
        const data = await translation(
          this.languages[0].query,
          this.languages[1].query,
          word,
        );
        console.log(data);
      }, delay);
    }
  }
}
