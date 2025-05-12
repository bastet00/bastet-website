import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CATEGORIES } from '../../pages/categories/categories';

interface Word {
  id: string;
  egyptian: string;
  symbol: string;
  arabic: string;
  category?: string[];
}

@Component({
  selector: 'app-translation-result',
  templateUrl: './translation-result.component.html',
  styleUrls: ['./translation-result.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class TranslationResultComponent {
  @Input() word!: Word;
  @Output() copyToClipboard = new EventEmitter<string>();

  hoverToElement: string | null = null;
  helperText = 'نسخ';

  constructor(private sanitizer: DomSanitizer) {}

  sanitizeSymbol(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  onMouseHover(wordId: string): void {
    this.hoverToElement = wordId;
  }

  onMouseLeave(): void {
    this.hoverToElement = null;
  }

  handleCopy(wordId: string): void {
    this.copyToClipboard.emit(wordId);
    this.helperText = 'تم النسخ ✓';
    setTimeout(() => {
      this.helperText = 'نسخ';
    }, 2000);
  }

  getCategoryViewValue(categoryValue: string): string {
    const category = CATEGORIES.find((cat) => cat.value === categoryValue);
    return category ? category.viewValue : categoryValue;
  }
}
