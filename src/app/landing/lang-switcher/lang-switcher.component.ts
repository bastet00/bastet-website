import { Component, OnInit } from '@angular/core';
import { Language } from '../interface';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [],
  templateUrl: './lang-switcher.component.html',
  styleUrl: './lang-switcher.component.scss',
})
export class LangSwitcherComponent implements OnInit {
  constructor(private languageService: LanguageService) {}
  languages: Language[] = [];

  ngOnInit(): void {
    this.languageService.languages$.subscribe((lang) => {
      this.languages = lang;
    });
  }

  onClick(): void {
    this.languageService.swapLanguages();
  }
}
