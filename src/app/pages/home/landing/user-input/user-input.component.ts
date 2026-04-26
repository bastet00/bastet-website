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

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  constructor(
    private languageService: LanguageService,
    private translationService: TranslationService,
    private literalTranslationService: LiteralTranslationService,
    private notificationService: NotificationService,
  ) {}

  languages: Language[] = [];

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
    this.literalRequestSub?.unsubscribe();
  }

  onChange(event: unknown, options: { delay?: number } = { delay: 300 }): void {
    const { delay } = options;

    if (this.handler) {
      clearTimeout(this.handler);
    }

    if (this.translationText.trim() !== '') {
      this.handler = setTimeout(() => {
        this.translationService
          .translation(this.languages[0].query, this.translationText)
          .subscribe();
        this.fetchHieroglyphicsLiteral();
      }, delay);
    } else {
      this.literalRequestSeq += 1;
      this.hieroglyphicsText = '';
      this.hieroglyphicsLoading = false;
      this.literalRequestSub?.unsubscribe();
      this.literalRequestSub = null;
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
    this.notificationService.success('تم نسخ الهيروغليفية ✓');
  }
}
