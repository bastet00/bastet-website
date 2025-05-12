import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CATEGORIES } from './categories';
import { TranslationResultComponent } from '../../components/translation-result/translation-result.component';
import { CategoryService } from '../../services/category.service';
import { toWordCardDto, WordCardDto } from '../../dto/word.dto';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  categories = CATEGORIES;
  selectedCategory = 'gods';
  words: WordCardDto[] = [];
  loading: boolean = true;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadWords();
  }

  onCategoryChange() {
    if (this.selectedCategory) {
      this.loadWords();
    }
  }

  loadWords() {
    this.loading = true;
    this.categoryService.getWordsByCategory(this.selectedCategory).subscribe({
      next: (words) => {
        this.words = words.map((word) => toWordCardDto(word)) as WordCardDto[];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading words:', error);
        this.loading = false;
      },
    });
  }
}
