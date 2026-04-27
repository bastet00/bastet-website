import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { mapWordToResultCard } from '../../../../utils/map-word-to-result-card.util';

@Component({
  selector: 'app-translation-box',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
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
  sentenceLineUsingArabicLetters = '';
  sentenceLoading = false;
  private sentenceRequestSeq = 0;
  private sentenceRequestSub: Subscription | null = null;

  Arabic = [] as ArabicWord[];
  words = [] as TranslationResToView[];
  /** Last search payload from API; re-mapped on Transloco language change. */
  private lastRawTranslation: TranslationRes[] = [];
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
    private transloco: TranslocoService,
    private cdr: ChangeDetectorRef,
  ) {}

  /** Transloco UI: English = LTR alignment for UI chrome; Arabic = RTL. */
  get uiLtr(): boolean {
    return this.transloco.getActiveLang() === 'en';
  }

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
    this.sentenceLineUsingArabicLetters = '';
    this.sentenceLoading = false;
    this.sentenceRequestSub?.unsubscribe();
    this.sentenceRequestSub = null;
  }

  private applyWordsFromCache(): void {
    this.words = this.lastRawTranslation.map((w) =>
      mapWordToResultCard(w, this.transloco.getActiveLang()),
    );
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
          this.lastRawTranslation = translation;
          this.applyWordsFromCache();
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
    this.streamSub.add(
      this.transloco.langChanges$.subscribe(() => {
        this.applyWordsFromCache();
        this.cdr.markForCheck();
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
          this.sentenceLineUsingArabicLetters =
            res.translationUsingArabicLetters ?? '';
          this.sentenceLoading = false;
        },
        error: () => {
          if (seq !== this.sentenceRequestSeq) {
            return;
          }
          this.sentenceLine = '';
          this.sentenceLineUsingArabicLetters = '';
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
    this.helperText = this.transloco.translate('translationBox.copyHint');
    (event.currentTarget as SVGElement).classList.add('scale-125');
  }

  onMouseLeave(event: MouseEvent) {
    this.hoverToElement = null;
    (event.currentTarget as SVGElement).classList.remove('scale-125');
  }

  addWordSuggestion() {
    this.notificationService.success(
      this.transloco.translate('notification.suggestionThanks'),
    );
  }

  copySentenceTranslation(
    text: string,
    event: Event | undefined,
    copyKind: 'ar' | 'lat' = 'lat',
  ) {
    event?.stopPropagation();
    if (!text) {
      return;
    }
    void navigator.clipboard.writeText(text);
    const key =
      copyKind === 'ar'
        ? 'toasts.translationArLettersCopied'
        : 'toasts.translationLatCopied';
    this.notificationService.success(this.transloco.translate(key));
  }

  sanitizeSymbol(symbol: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(symbol);
  }
}
