/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from '../../../../services/language.service';
import { Language } from '../interface';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../services/api/translation.service';
import { LiteralTranslationService } from '../../../../services/api/literal-translation.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../components/notification/notification.service';
import { LandingSearchTextService } from '../../../../services/landing-search-text.service';
import { MAX_TRANSLATION_INPUT_LENGTH } from '../../../../constants/translation-input-limits';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss',
})
export class UserInputComponent implements OnInit, OnDestroy {
  translationText: string = '';
  /** Literal hieroglyphic string from the dictionary literal-translation API. */
  hieroglyphicsText: string = '';
  hieroglyphicsLoading: boolean = false;
  private literalRequestSeq = 0;
  private literalRequestSub: Subscription | null = null;
  private wordRequestSub: Subscription | null = null;
  /** Set while input length > max so we only toast once until back within limit. */
  private isOverInputLimit = false;
  constructor(
    private languageService: LanguageService,
    private translationService: TranslationService,
    private literalTranslationService: LiteralTranslationService,
    private notificationService: NotificationService,
    private landingSearchText: LandingSearchTextService,
    private transloco: TranslocoService,
  ) {}

  languages: Language[] = [];

  inputLangKey(l: Language | undefined): string {
    if (!l) {
      return 'input.forQueryArabic';
    }
    return l.query === 'egyptian'
      ? 'input.forQueryEgyptian'
      : 'input.forQueryArabic';
  }

  ngOnInit(): void {
    this.languageService.languages$.subscribe((lang) => {
      this.languages = lang;
    });
  }

  onLanguageSwitch(): void {
    this.languageService.swapLanguages();
    this.onChange(this.translationText, { delay: 0 });
  }

  loading: boolean = false;
  private handler: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy(): void {
    if (this.handler) {
      clearTimeout(this.handler);
    }
    this.literalRequestSeq++;
    this.translationService.cancelInFlightSearch();
    this.literalTranslationService.cancelInFlight();
    this.wordRequestSub?.unsubscribe();
    this.literalRequestSub?.unsubscribe();
  }

  onChange(event: unknown, options: { delay?: number } = { delay: 300 }): void {
    const { delay } = options;

    this.landingSearchText.setText(this.translationText);

    if (this.handler) {
      clearTimeout(this.handler);
    }

    if (this.translationText.trim() !== '') {
      this.handler = setTimeout(() => {
        const text = this.translationText;
        if (text.length > MAX_TRANSLATION_INPUT_LENGTH) {
          this.wordRequestSub?.unsubscribe();
          this.wordRequestSub = null;
          this.translationService.setNull();
          this.literalRequestSeq += 1;
          this.hieroglyphicsText = '';
          this.hieroglyphicsLoading = false;
          this.literalRequestSub?.unsubscribe();
          this.literalRequestSub = null;
          if (!this.isOverInputLimit) {
            this.notificationService.error(
              this.transloco.translate('toasts.translationLimit'),
              6000,
            );
            this.isOverInputLimit = true;
          }
          return;
        }
        this.isOverInputLimit = false;
        this.wordRequestSub?.unsubscribe();
        this.wordRequestSub = this.translationService
          .translation(this.languages[0].query, this.translationText)
          .subscribe();
        this.fetchHieroglyphicsLiteral();
      }, delay);
    } else {
      this.isOverInputLimit = false;
      this.literalRequestSeq += 1;
      this.hieroglyphicsText = '';
      this.hieroglyphicsLoading = false;
      this.literalRequestSub?.unsubscribe();
      this.literalRequestSub = null;
      this.wordRequestSub?.unsubscribe();
      this.wordRequestSub = null;
      this.translationService.setNull();
    }
  }

  private fetchHieroglyphicsLiteral(): void {
    const seq = ++this.literalRequestSeq;
    this.hieroglyphicsLoading = true;
    this.literalRequestSub?.unsubscribe();
    this.literalRequestSub = this.literalTranslationService
      .getLiteralTranslation(this.translationText)
      .subscribe({
        next: (res) => {
          if (seq !== this.literalRequestSeq) {
            return;
          }
          this.hieroglyphicsText = res.literalTranslation ?? '';
          this.hieroglyphicsLoading = false;
        },
        error: () => {
          if (seq !== this.literalRequestSeq) {
            return;
          }
          this.hieroglyphicsText = '';
          this.hieroglyphicsLoading = false;
        },
        complete: () => {
          if (seq === this.literalRequestSeq) {
            this.hieroglyphicsLoading = false;
          }
        },
      });
  }

  addText(text: string) {
    this.translationText = text;
    this.onChange(text, { delay: 0 });
  }

  copyLiteralHieroglyphics(event?: Event): void {
    event?.stopPropagation();
    if (!this.hieroglyphicsText) {
      return;
    }
    void navigator.clipboard.writeText(this.hieroglyphicsText);
    this.notificationService.success(
      this.transloco.translate('toasts.hieroLiteralCopied'),
    );
  }
}
