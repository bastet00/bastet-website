import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { UserInputComponent } from '../landing/user-input/user-input.component';
import { TranslationService } from '../services/translation.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslationResToView } from '../landing/interface';
import { FormsModule } from '@angular/forms';
import { WordAdminService } from '../services/api/single-doc.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [UserInputComponent, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private translationService: TranslationService,
    private senitizer: DomSanitizer,
    private singleDocService: WordAdminService
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
          const ar = obj.arabic.map((index) => index.word).join(' - ');
          const en = obj.english.map((index) => index.word).join(' - ');
          const eg = obj.egyptian[0].word;
          const sym = this.translationService.toSymbol(obj.egyptian[0].symbol);
          const hexSym = obj.egyptian[0].symbol;
          this.data.push({
            id: id,
            arabic: ar,
            egyptian: eg,
            symbol: sym,
            english: en,
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
      obj.symbol = inputElement.value;
    }
  }

  async delete(id: string) {
    const res = await lastValueFrom(this.singleDocService.delete(id));
    if (res.ok) {
      this.clearDisplayedDocs(id);
      alert('تم الحذف بنجاح');
    } else {
      alert('حدث خطأ ما');
    }
  }

  async put(newObj: TranslationResToView) {
    const res = await firstValueFrom(this.translationService.data$);
    const target = res.find((obj) => obj.id === newObj.id);
    if (target) {
      const putRes = await lastValueFrom(
        this.singleDocService.put(target, newObj)
      );
      if (putRes.ok) {
        alert('تم التحديث بنجاح');
      } else {
        alert('حدث خطأ ما');
      }
    }
  }
}
