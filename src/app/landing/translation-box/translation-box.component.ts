import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import {
  ArabicWord,
  EgyptianWord,
  TranslationRes,
  TranslationResToView,
} from '../interface';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SuspendComponent } from '../../suspend/suspend.component';

@Component({
  selector: 'app-translation-box',
  standalone: true,
  imports: [CommonModule, SuspendComponent],
  templateUrl: './translation-box.component.html',
  styleUrl: './translation-box.component.scss',
})
export class TranslationBoxComponent implements OnInit {
  constructor(
    private transService: TranslationService,
    private sanitizer: DomSanitizer
  ) {}

  Egyptian = [] as EgyptianWord[];
  Arabic = [] as ArabicWord[];
  words = [] as TranslationResToView[];
  loading = true;

  ngOnInit(): void {
    this.transService.data$.subscribe({
      next: (translation: TranslationRes[]) => {
        this.words = translation.map((word) => {
          return {
            id: word.id,
            Arabic: word.Arabic.map((arabic) => arabic.Word).join(', '),
            Egyptian: word.Egyptian[0].Word,
            Symbol: word.Egyptian[0].Symbol,
          };
        });
      },
    });

    this.transService.loading$.subscribe({
      next: (loading) => {
        this.loading = loading;
      },
    });
  }

  sanitizeSymbol(symbol: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(symbol);
  }
}
