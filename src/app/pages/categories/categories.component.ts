import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CATEGORIES } from './categories';
import { TranslationResultComponent } from '../../components/translation-result/translation-result.component';
import { CategoryService } from '../../services/category.service';
import { Word, WordCardDto } from '../../dto/word.dto';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { mapWordToResultCard } from '../../utils/map-word-to-result-card.util';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    NavbarComponent,
    LucideAngularModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    TranslationResultComponent,
    CommonModule,
    TranslocoModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories = CATEGORIES;
  selectedCategory = 'gods';
  /** API payload; re-mapped when UI language changes (same as landing similar words). */
  private rawWords: Word[] = [];
  words: WordCardDto[] = [];
  loading: boolean = true;
  private langSub?: Subscription;

  constructor(
    private categoryService: CategoryService,
    private transloco: TranslocoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.langSub = this.transloco.langChanges$.subscribe(() => {
      this.applyWordViewFromCache();
      this.cdr.markForCheck();
    });
    this.loadWords();
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  onCategoryChange() {
    if (this.selectedCategory) {
      this.loadWords();
    }
  }

  private applyWordViewFromCache() {
    this.words = this.rawWords.map((w) =>
      mapWordToResultCard(w, this.transloco.getActiveLang()),
    ) as WordCardDto[];
  }

  loadWords() {
    this.loading = true;
    this.categoryService.getWordsByCategory(this.selectedCategory).subscribe({
      next: (words) => {
        this.rawWords = words;
        this.applyWordViewFromCache();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading words:', error);
        this.loading = false;
      },
    });
  }
}
