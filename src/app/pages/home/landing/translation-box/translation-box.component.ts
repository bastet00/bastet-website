import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslationService } from '../../../../services/api/translation.service';
import { SentenceTranslationService } from '../../../../services/api/sentence-translation.service';
import { LandingSearchTextService } from '../../../../services/landing-search-text.service';
import { LanguageService } from '../../../../services/language.service';
import { ArabicWord, TranslationRes, TranslationResToView } from '../interface';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { SuspendComponent } from '../../../../components/suspend/suspend.component';
import { NotificationComponent } from '../../../../components/notification/notification.component';
import { RouterModule } from '@angular/router';
import { TranslationResultComponent } from '../../../../components/translation-result/translation-result.component';
import { NotificationService } from '../../../../components/notification/notification.service';
import {
  isSingleWordText,
  MAX_TRANSLATION_INPUT_LENGTH,
} from '../../../../constants/translation-input-limits';

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
export class TranslationBoxComponent implements OnInit, OnDestroy {
  /** Mirrors landing input; sentence *ngIf uses this. */
  searchText = '';

  sentenceLine = '';
  sentenceLoading = false;
  private sentenceRequestSeq = 0;
  private sentenceRequestSub: Subscription | null = null;

  Arabic = [] as ArabicWord[];
  words = [] as TranslationResToView[];
  /** Synced with TranslationService.loading$ (BehaviorSubject false initially). */
  loading = false;
  showAddingSuggestionSuccess = false;
  private streamSub = new Subscription();

  constructor(
    private transService: TranslationService,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService,
    private sentenceTranslationService: SentenceTranslationService,
    private landingText: LandingSearchTextService,
    private languageService: LanguageService,
  ) {}

  helperText: string = '';
  hoverToElement: string | null = null;
  emptyRes = false;

  get isSentenceBlockVisible(): boolean {
    const raw = this.searchText ?? '';
    if (!raw.trim() || raw.length > MAX_TRANSLATION_INPUT_LENGTH) {
      return false;
    }
    return !isSingleWordText(raw);
  }

  private clearSentenceState(): void {
    this.sentenceRequestSeq += 1;
    this.sentenceLine = '';
    this.sentenceLoading = false;
    this.sentenceRequestSub?.unsubscribe();
    this.sentenceRequestSub = null;
  }

  ngOnInit(): void {
    this.streamSub.add(
      this.landingText.text$.subscribe((t) => {
        this.searchText = t;
      }),
    );
    this.streamSub.add(
      this.landingText.text$
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((text) => {
          if (!text || !text.trim()) {
            this.clearSentenceState();
            return;
          }
          if (text.length > MAX_TRANSLATION_INPUT_LENGTH) {
            this.clearSentenceState();
            return;
          }
          if (isSingleWordText(text)) {
            this.clearSentenceState();
            return;
          }
          this.fetchSentenceTranslation(text);
        }),
    );
    this.streamSub.add(
      this.languageService.languages$.subscribe(() => {
        const t = this.searchText;
        if (!t?.trim() || t.length > MAX_TRANSLATION_INPUT_LENGTH) {
          this.clearSentenceState();
          return;
        }
        if (isSingleWordText(t)) {
          this.clearSentenceState();
          return;
        }
        this.fetchSentenceTranslation(t);
      }),
    );
    this.streamSub.add(
      this.transService.data$.subscribe({
        next: (translation: TranslationRes[]) => {
          this.words = translation.map((word) => {
            return {
              id: word.id,
              arabic: word.arabic.map((arabic) => arabic.word).join(', '),
              egyptian: word.egyptian[0].word,
              category: word.category,
              hieroglyphicSigns: word.egyptian[0].hieroglyphicSigns?.join(' '),
            };
          });
        },
      }),
    );
    this.streamSub.add(
      this.transService.loading$.subscribe((loading) => {
        this.loading = loading;
      }),
    );
    this.streamSub.add(
      this.transService.emptyRes$.subscribe((emptyRes) => {
        this.emptyRes = emptyRes;
      }),
    );
  }

  ngOnDestroy(): void {
    this.sentenceRequestSeq++;
    this.sentenceTranslationService.cancelInFlight();
    this.streamSub.unsubscribe();
    this.sentenceRequestSub?.unsubscribe();
  }

  private fetchSentenceTranslation(text: string): void {
    if (
      !text?.trim() ||
      text.length > MAX_TRANSLATION_INPUT_LENGTH ||
      isSingleWordText(text)
    ) {
      return;
    }
    const q = this.languageService.getLanguages()[0]?.query;
    if (!q) {
      return;
    }
    const seq = ++this.sentenceRequestSeq;
    this.sentenceLoading = true;
    this.sentenceRequestSub?.unsubscribe();
    this.sentenceRequestSub = this.sentenceTranslationService
      .getSentenceTranslation(text, q)
      .subscribe({
        next: (res) => {
          if (seq !== this.sentenceRequestSeq) {
            return;
          }
          this.sentenceLine = res.translation ?? '';
          this.sentenceLoading = false;
        },
        error: () => {
          if (seq !== this.sentenceRequestSeq) {
            return;
          }
          this.sentenceLine = '';
          this.sentenceLoading = false;
        },
        complete: () => {
          if (seq === this.sentenceRequestSeq) {
            this.sentenceLoading = false;
          }
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
    this.notificationService.success(
      'لقد تم تقديم هذه الكلمة للمراجعة، شكرا لك',
    );
  }

  copySentenceTranslation(event?: Event) {
    event?.stopPropagation();
    if (!this.sentenceLine) {
      return;
    }
    void navigator.clipboard.writeText(this.sentenceLine);
    this.notificationService.success('تم نسخ الترجمة ✓');
  }

  sanitizeSymbol(symbol: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(symbol);
  }
}
