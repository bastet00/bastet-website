import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LangSwitcherComponent } from '../landing/lang-switcher/lang-switcher.component';
import { UserInputComponent } from '../landing/user-input/user-input.component';
import { TranslationService } from '../services/translation.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslationResToView } from '../landing/interface';
import { FormsModule } from '@angular/forms';
import { SingleDocService } from '../services/single-doc.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [LangSwitcherComponent, UserInputComponent, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private translationService: TranslationService,
    private senitizer: DomSanitizer,
    private singleDocService: SingleDocService,
  ) {}

  data: TranslationResToView[] = [];

  ngOnInit(): void {
    this.loginService.isTrusted$.subscribe((val) => {
      if (!val) {
        this.router.navigateByUrl('/');
      }

      this.translationService.data$.subscribe((res) => {
        this.data = []; // reset between calls
        res.forEach((obj) => {
          const id = obj.id;
          const ar = obj.Arabic.map((index) => index.Word).join(' - ');
          const en = obj.English.map((index) => index.Word).join(' - ');
          const eg = obj.Egyptian[0].Word;
          const sym = this.translationService.toSymbol(obj.Egyptian[0].Symbol);
          const hexSym = obj.Egyptian[0].Symbol;
          this.data.push({
            id: id,
            Arabic: ar,
            Egyptian: eg,
            Symbol: sym,
            English: en,
            hexSym: hexSym,
          });
        });
      });
    });
  }

  sanitizeSymbol(symbol: string): SafeHtml {
    return this.senitizer.bypassSecurityTrustHtml(symbol);
  }

  clearDisplayedDocs(id: string) {
    this.data = this.data.filter((obj) => obj.id !== id);
  }

  updateSymbol(event: Event, id: string) {
    const inputElement = event.target as HTMLInputElement;
    const obj = this.data.find((obj) => obj.id === id);
    if (obj) {
      obj.Symbol = inputElement.value;
    }
  }

  async delete(id: string) {
    this.singleDocService.delete(id).subscribe((res) => {
      if (res.ok) {
        this.clearDisplayedDocs(id);
      }
    });
  }

  async put(newObj: TranslationResToView) {
    this.translationService.data$.subscribe((res) => {
      const target = res.find((obj) => obj.id === newObj.id);
      if (target) {
        this.singleDocService.put(target, newObj).subscribe();
      }
    });
  }
}
