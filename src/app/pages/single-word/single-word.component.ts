import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslationService } from '../../services/api/translation.service';
import { Word } from '../../dto/word.dto';
import { LandingBackgroundComponent } from '../../components/landing-background/landing-background.component';
import { ArabicWord, TranslationResToView } from '../home/landing/interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
import { SuspendComponent } from '../../components/suspend/suspend.component';
import { LucideAngularModule, ArrowRight, CheckIcon } from 'lucide-angular';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-single-word',
  standalone: true,
  imports: [
    LandingBackgroundComponent,
    CommonModule,
    SuspendComponent,
    LucideAngularModule,
    RouterModule,
    TranslocoModule,
  ],
  templateUrl: './single-word.component.html',
  styleUrl: './single-word.component.scss',
})
export class SingleWordComponent implements OnInit, OnDestroy {
  readonly ArrowRight = ArrowRight;
  readonly checkIcon = CheckIcon;
  private langSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private sanitizer: DomSanitizer,
    private location: Location,
    private transloco: TranslocoService,
    private cdr: ChangeDetectorRef,
  ) {
    this.langSub = this.transloco.langChanges$.subscribe(() =>
      this.cdr.markForCheck(),
    );
  }

  singleWord: Word = {} as Word;
  singleWordToView = {} as TranslationResToView;

  /** English UI: Latin transliteration; Arabic: dictionary Egyptian (Arabic) form. Same as landing word cards. */
  get mainWordHeading(): string {
    const e0 = this.singleWord?.egyptian?.[0];
    if (!e0) {
      return this.singleWordToView.egyptian ?? '';
    }
    if (this.transloco.getActiveLang() === 'en') {
      const tr = e0.transliteration?.trim();
      return (tr || e0.word) ?? '';
    }
    return e0.word ?? '';
  }

  get isUiEn(): boolean {
    return this.transloco.getActiveLang() === 'en';
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id') as string;
    this.getWord(param);
  }

  toClipboard(key: keyof TranslationResToView, copiedEle: HTMLElement) {
    copiedEle.style.display = 'block';
    copiedEle.classList.add('animate-ping');
    const toCopy = this.singleWordToView[key] as string;

    setTimeout(() => {
      copiedEle.classList.remove('animate-ping');
      copiedEle.style.display = 'none';
    }, 500);

    navigator.clipboard.writeText(toCopy);
  }

  navigateBack() {
    this.location.back();
  }

  arrToView(obj: ArabicWord[]): string {
    return obj.map((words) => words.word).join(' , ');
  }

  async getWord(id: string) {
    this.singleWord = await this.translationService.getOne(id);
    this.singleWordToView.egyptian = this.singleWord.egyptian[0].word;
    this.singleWordToView.id = this.singleWord.id;
    this.singleWordToView.arabic = this.arrToView(this.singleWord.arabic);
    this.singleWordToView.english = this.arrToView(this.singleWord.english);
    this.singleWordToView.hieroglyphics =
      this.singleWord.egyptian[0].hieroglyphics.join(' , ');
    this.singleWordToView.transliteration =
      this.singleWord.egyptian[0].transliteration;

    this.singleWordToView.resources = this.singleWord.resources.join(' ');
    this.singleWordToView.hieroglyphicSigns =
      this.singleWord.egyptian[0].hieroglyphicSigns.join(' ');
  }

  sanitizeSymbol(symbol: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(symbol);
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }
}
