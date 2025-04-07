import { Component, OnInit } from '@angular/core';
import { TranslationBoxComponent } from '../landing/translation-box/translation-box.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { Word } from '../dto/word.dto';
import { LandingBackgroundComponent } from '../landing-background/landing-background.component';
import { ArabicWord, TranslationResToView } from '../landing/interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
import { SuspendComponent } from '../suspend/suspend.component';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-single-word',
  standalone: true,
  imports: [
    TranslationBoxComponent,
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
  }

  sanitizeSymbol(symbol: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(symbol);
  }
}
