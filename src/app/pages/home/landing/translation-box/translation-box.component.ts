import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../../../services/api/translation.service';
import {
  ArabicWord,
  EgyptianWord,
  TranslationRes,
  TranslationResToView,
} from '../interface';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SuspendComponent } from '../../../../components/suspend/suspend.component';
import { NotificationComponent } from '../../../../components/notification/notification.component';
import { RouterModule } from '@angular/router';
import { TranslationResultComponent } from '../../../../components/translation-result/translation-result.component';

@Component({
  selector: 'app-translation-box',
  standalone: true,
  imports: [
    CommonModule,
    SuspendComponent,
    NotificationComponent,
    RouterModule,
    TranslationResultComponent,
  ],
  templateUrl: './translation-box.component.html',
  styleUrl: './translation-box.component.scss',
})
export class TranslationBoxComponent implements OnInit {
  Egyptian = [] as EgyptianWord[];
  Arabic = [] as ArabicWord[];
  words = [] as TranslationResToView[];
  loading = true;
  showAddingSuggestionSuccess = false;
  constructor(
    private transService: TranslationService,
    private sanitizer: DomSanitizer,
  ) {}

  helperText: string = '';
  hoverToElement: string | null = null;
  emptyRes = false;

  ngOnInit(): void {
    this.transService.data$.subscribe({
      next: (translation: TranslationRes[]) => {
        this.words = translation.map((word) => {
          return {
            id: word.id,
            arabic: word.arabic.map((arabic) => arabic.word).join(', '),
            egyptian: word.egyptian[0].word,
            symbol: this.transService.toSymbol(word.egyptian[0].symbol),
            category: word.category,
          };
        });
      },
    });

    this.transService.loading$.subscribe({
      next: (loading) => {
        this.loading = loading;
      },
    });
    this.transService.emptyRes$.subscribe({
      next: (emptyRes) => {
        this.emptyRes = emptyRes;
      },
    });
  }

  onMouseHover(id: string, event: MouseEvent) {
    this.hoverToElement = id;
    this.helperText = 'انسخ';
    (event.currentTarget as SVGElement).classList.add('scale-125');
  }

  onMouseLeave(event: MouseEvent) {
    this.hoverToElement = null;
    (event.currentTarget as SVGElement).classList.remove('scale-125');
  }

  addWordSuggestion() {
    // TODO: replace with observable
    this.showAddingSuggestionSuccess = true;
    setTimeout(() => {
      this.showAddingSuggestionSuccess = false;
    }, 3000);
  }

  sanitizeSymbol(symbol: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(symbol);
  }
}
