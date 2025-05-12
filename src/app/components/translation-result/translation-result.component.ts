import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
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

  hoverToElement: string | null = null;
  helperText = 'نسخ';
  @ViewChildren('translationRef') transRefs!: QueryList<ElementRef>;

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

  handleCopy(id: string): void {
    this.hoverToElement = id;

    const ele = this.transRefs.find(
      (ref) => ref.nativeElement.getAttribute('data-id') === id,
    )?.nativeElement as HTMLDivElement;

    let toCopy = '';
    ele.childNodes.forEach((node) => (toCopy += node.textContent));
    navigator.clipboard.writeText(toCopy);
    this.helperText = 'تم النسخ ✓';

    setTimeout(() => {
      this.hoverToElement = null;
    }, 1000);
  }

  getCategoryViewValue(categoryValue: string): string {
    const category = CATEGORIES.find((cat) => cat.value === categoryValue);
    return category ? category.viewValue : categoryValue;
  }
}
