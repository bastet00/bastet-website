import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    private sanitizer: DomSanitizer,
  ) {}

  Egyptian = [] as EgyptianWord[];
  Arabic = [] as ArabicWord[];
  words = [] as TranslationResToView[];
  loading = true;
  @ViewChild('translationRef') transRef!: ElementRef;

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

  selectText(event: MouseEvent) {
    const range = document.createRange();
    const target = event.currentTarget as HTMLDivElement;

    range.selectNodeContents(target);
    const selection = window.getSelection();
    selection?.addRange(range);
  }

  toClipboard() {
    const ele = this.transRef.nativeElement as HTMLDivElement;
    let toCopy = '';
    ele.childNodes.forEach((node) => (toCopy += node.textContent));
    navigator.clipboard.writeText(toCopy);
  }

  sanitizeSymbol(symbol: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(symbol);
  }
}
