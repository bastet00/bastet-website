import { Component, OnInit } from '@angular/core';
import { TranslationBoxComponent } from '../landing/translation-box/translation-box.component';
import { ActivatedRoute } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { Word } from '../dto/word.dto';
import { LandingBackgroundComponent } from '../landing-background/landing-background.component';
import { ArabicWord, TranslationResToView } from '../landing/interface';

@Component({
  selector: 'app-single-word',
  standalone: true,
  imports: [TranslationBoxComponent, LandingBackgroundComponent],
  templateUrl: './single-word.component.html',
  styleUrl: './single-word.component.scss',
})
export class SingleWordComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private translationService: TranslationService,
  ) {}

  singleWord: Word = {} as Word;
  mapSingleWordToView = {} as TranslationResToView;

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id') as string;
    this.getWord(param);
  }

  jsonToView(obj: ArabicWord[]): string {
    return obj.map((words) => words.word).join(' , ');
  }

  async getWord(id: string) {
    this.singleWord = await this.translationService.getOne(id);
    this.mapSingleWordToView.symbol = this.translationService.toSymbol(
      this.singleWord.egyptian[0].symbol,
    );
    this.mapSingleWordToView.egyptian = this.singleWord.egyptian[0].word;
    this.mapSingleWordToView.id = this.singleWord.id;
    this.mapSingleWordToView.arabic = this.jsonToView(this.singleWord.arabic);
    this.mapSingleWordToView.english = this.jsonToView(this.singleWord.english);
  }
}
