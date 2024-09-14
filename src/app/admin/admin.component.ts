import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LangSwitcherComponent } from '../landing/lang-switcher/lang-switcher.component';
import { UserInputComponent } from '../landing/user-input/user-input.component';
import { TranslationService } from '../services/translation.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslationResToView } from '../landing/interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [LangSwitcherComponent, UserInputComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private translationService: TranslationService,
    private senitizer: DomSanitizer,
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
          const eg = obj.Egyptian[0].Word;
          const sym = obj.Egyptian[0].Symbol;
          this.data.push({ id: id, Arabic: ar, Egyptian: eg, Symbol: sym });
        });
      });
    });
  }

  sanitizeSymbol(symbol: string): SafeHtml {
    return this.senitizer.bypassSecurityTrustHtml(symbol);
  }

  delete(id: string) {
    console.log(id);
  }

  put(obj: TranslationResToView) {
    console.log(obj);
  }
}
