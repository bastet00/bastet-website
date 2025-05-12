import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslationService } from '../../services/api/translation.service';
import { Word } from '../../dto/word.dto';
import { LandingBackgroundComponent } from '../../components/landing-background/landing-background.component';
import { ArabicWord, TranslationResToView } from '../home/landing/interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
import { SuspendComponent } from '../../components/suspend/suspend.component';
import { LucideAngularModule, ArrowRight, CheckIcon } from 'lucide-angular';

@Component({
  selector: 'app-single-word',
  standalone: true,
  imports: [
    LandingBackgroundComponent,
    CommonModule,
    SuspendComponent,
    LucideAngularModule,
    RouterModule,
  ],
  templateUrl: './single-word.component.html',
  styleUrl: './single-word.component.scss',
})
export class SingleWordComponent implements OnInit {
  readonly ArrowRight = ArrowRight;
  readonly checkIcon = CheckIcon;

  constructor(
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private sanitizer: DomSanitizer,
    private location: Location,
  ) {}

  singleWord: Word = {} as Word;
  singleWordToView = {} as TranslationResToView;

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id') as string;
    this.getWord(param);
  }

  toClipboard(key: keyof TranslationResToView, copiedEle: HTMLElement) {
    copiedEle.style.display = 'block';
    copiedEle.classList.add('animate-ping');
    let toCopy = this.singleWordToView[key] as string;
    if (key === 'symbol') {
      // convert from html entity to string representation
      toCopy = toCopy.replace(/[^0-9a-z-A-Z ]/g, '').replace(/ +/, ' ');
      toCopy = String.fromCodePoint(+toCopy);
    }

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
    this.singleWordToView.symbol = this.translationService.toSymbol(
      this.singleWord.egyptian[0].symbol,
    );
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
}
