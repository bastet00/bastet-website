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
import { NotificationService } from '../notification/notification.service';

interface Word {
  id: string;
  egyptian: string;
  arabic: string;
  hieroglyphicSigns?: string;
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

  @ViewChildren('translationRef') transRefs!: QueryList<ElementRef>;

  constructor(
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService,
  ) {}

  sanitizeSymbol(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  handleCopyHiero(): void {
    navigator.clipboard.writeText(this.word.hieroglyphicSigns ?? '');
    this.notificationService.success('تم نسخ الهيروغليفية ✓');
  }

  handleShare(id: string): void {
    const url = `${window.location.origin}/word/${id}`;
    navigator.clipboard.writeText(url);
    this.notificationService.success('تم نسخ الرابط ✓');
  }

  handleCopy(id: string): void {
    const ele = this.transRefs.find(
      (ref) => ref.nativeElement.getAttribute('data-id') === id,
    )?.nativeElement as HTMLDivElement;

    let toCopy = '';
    ele.childNodes.forEach((node) => (toCopy += node.textContent));
    navigator.clipboard.writeText(toCopy);
    this.notificationService.success('تم النسخ ✓');
  }

  getCategoryViewValue(categoryValue: string): string {
    const category = CATEGORIES.find((cat) => cat.value === categoryValue);
    return category ? category.viewValue : categoryValue;
  }
}
