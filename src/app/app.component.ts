import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordDetailComponent } from './word-detail/word-detail.component';
import { SearchService } from './search.service';
import { WordList } from './dto/word.dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { LandingComponent } from './landing/landing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WordDetailComponent,
    CommonModule,
    FormsModule,
    NavbarComponent,
    LandingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bastet';
  searchService: SearchService = inject(SearchService);
  words: WordList = [];
  selectedLanguage = 'Arabic';
  languages = ['Arabic', 'Egyptian'];
  icon = '&#' + 'x00013150' + ';';

  filterResults(text: string) {
    if (!text) {
      return;
    }
    console.log(this.selectedLanguage);
    this.searchService
      .getWords(text, this.selectedLanguage)
      .subscribe((words) => (this.words = words));
  }
}
