import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { UserInputComponent } from '../landing/user-input/user-input.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslationResToView } from '../landing/interface';
import { FormsModule } from '@angular/forms';
import {
  AdminWordViewList,
  WordAdminService,
} from '../services/api/admin-word.service';
import { lastValueFrom } from 'rxjs';
import { LANGUAGES } from '../dto/types/language.type';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [UserInputComponent, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  adminTranslationLanguages = {
    translateFrom: LANGUAGES.arabic,
    translateTo: LANGUAGES.egyptian,
  };
  results: AdminWordViewList | undefined;
  translationText: string = '';
  constructor(
    private loginService: LoginService,
    private router: Router,
    private senitizer: DomSanitizer,
    private wordAdminService: WordAdminService
  ) {}

  data: TranslationResToView[] = [];
  private handler: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loginService.isTrusted$.subscribe((val) => {
      if (!val) {
        this.router.navigateByUrl('/');
      }
    });
  }

  onTextInputChange(options: { delay?: number } = { delay: 300 }) {
    if (!this.translationText) {
      return;
    }
    const { delay } = options;

    if (this.handler) {
      clearTimeout(this.handler);
    }
    if (this.translationText.trim() !== '') {
      this.handler = setTimeout(() => {
        this.wordAdminService
          .getWords(
            this.translationText,
            this.adminTranslationLanguages.translateFrom.query
          )
          .subscribe((results) => (this.results = results));
      }, delay);
    } else {
      this.results = undefined;
    }
  }

  addText(text: string) {
    this.translationText = text;
    this.onTextInputChange({ delay: 0 });
  }

  onLanguageSwitch() {
    if (this.adminTranslationLanguages.translateFrom === LANGUAGES.arabic) {
      this.adminTranslationLanguages.translateFrom = LANGUAGES.egyptian;
      this.adminTranslationLanguages.translateTo = LANGUAGES.arabic;
    } else {
      this.adminTranslationLanguages.translateFrom = LANGUAGES.arabic;
      this.adminTranslationLanguages.translateTo = LANGUAGES.egyptian;
    }
    this.onTextInputChange();
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
      obj.symbol = inputElement.value;
    }
  }

  async delete(id: string) {
    const res = await lastValueFrom(this.wordAdminService.delete(id));
    if (res.ok) {
      this.clearDisplayedDocs(id);
      alert('تم الحذف بنجاح');
    } else {
      alert('حدث خطأ ما');
    }
  }

  async put(newObj: TranslationResToView) {
    const target = this.results!.items.find((obj) => obj.id === newObj.id);
    if (target) {
      const putRes = await lastValueFrom(
        this.wordAdminService.put(target, newObj)
      );
      if (putRes.ok) {
        alert('تم التحديث بنجاح');
      } else {
        alert('حدث خطأ ما');
      }
    }
  }
}
