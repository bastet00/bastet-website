import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/api/login.service';
import { Router } from '@angular/router';
import { UserInputComponent } from '../../home/landing/user-input/user-input.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslationResToView } from '../../home/landing/interface';
import { FormsModule } from '@angular/forms';
import {
  AdminWordViewList,
  WordAdminService,
} from '../../../services/api/admin-word.service';
import { lastValueFrom } from 'rxjs';
import { LANGUAGES } from '../../../dto/types/language.type';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MyCustomPaginatorIntl } from './pagination.service';
import { ArrowDown, LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/api/category.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    UserInputComponent,
    FormsModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    LucideAngularModule,
    CommonModule,
  ],
  templateUrl: './admin.component.html',
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],

  styleUrl: './admin.component.scss',
})
export class AdminUpdateWordComponent implements OnInit {
  readonly arrowDown = ArrowDown;

  categoryStash: { [key: string]: string[] } = {};
  categoryList: string[] = [];

  adminTranslationLanguages = {
    translateFrom: LANGUAGES.arabic,
    translateTo: LANGUAGES.egyptian,
  };
  results: AdminWordViewList | undefined;
  translationText: string = '';
  private handler: ReturnType<typeof setTimeout> | null = null;
  page: number = 1;
  count: number = 0;
  perPage = 25;
  pageSizeOptions = [5, 10, 25, 50, 100, 200, 500];
  userInputPage = this.page;
  dropDownState = {} as { [key: string]: boolean };
  constructor(
    private loginService: LoginService,
    private router: Router,
    private senitizer: DomSanitizer,
    private wordAdminService: WordAdminService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.loginService.isTrusted$.subscribe((val) => {
      if (!val) {
        this.router.navigateByUrl('/');
      }
    });

    this.categoryService.getCategories().subscribe((value) => {
      this.categoryList = value.category;
    });
  }

  toggleDropdown(objId: string) {
    this.dropDownState[objId] = !this.dropDownState[objId];
  }

  onCategoryClicked(category: string, id: string) {
    if (!this.categoryStash[id]) {
      this.categoryStash[id] = [];
    }
    if (this.categoryStash[id].includes(category)) {
      this.categoryStash[id] = this.categoryStash[id].filter(
        (item) => item !== category,
      );
    } else {
      this.categoryStash[id].push(category);
    }
  }

  enterPageIndex(_event: Event) {
    this.page = this.userInputPage;
    this.onTextInputChange({ delay: 0 });
  }

  prePushCategoryStash() {
    this.results?.itemsForView.map((item) => {
      this.categoryStash[item.id] = item.category || [];
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
            this.adminTranslationLanguages.translateFrom.query,
            { page: this.page, perPage: this.perPage },
          )
          .subscribe((results) => {
            this.results = results;
            this.count = results.count;
            this.results.itemsForView.map((item) => {
              this.categoryStash[item.id] = item.category || [];
            });
          });
      }, delay);
    } else {
      this.results = undefined;
    }
  }
  onPageChange(event: PageEvent) {
    this.page = event.pageIndex;
    this.count = event.length;
    this.perPage = event.pageSize;
    this.onTextInputChange({ delay: 0 });
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
    this.results!.itemsForView = this.results!.itemsForView.filter(
      (obj) => obj.id !== id,
    );
  }

  updateSymbol(event: Event, id: string) {
    const data = this.results!.itemsForView;
    const inputElement = event.target as HTMLInputElement;
    const obj = data.find((obj) => obj.id === id);
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

  updateCategoryView(id: string) {
    if (this.results) {
      this.results = {
        ...this.results,
        itemsForView: this.results?.itemsForView.map((item) =>
          item.id === id ? { ...item, category: this.categoryStash[id] } : item,
        ),
      };
    }
  }

  async put(newObj: TranslationResToView) {
    const target = this.results!.items.find((obj) => obj.id === newObj.id);
    if (target) {
      target.category = this.categoryStash[newObj.id] || [];
      const putRes = await lastValueFrom(
        this.wordAdminService.put(target, newObj),
      );
      if (putRes.ok) {
        alert('تم التحديث بنجاح');
        this.updateCategoryView(target.id);
        this.categoryStash[target.id] = target.category;
        this.dropDownState = {};
      } else {
        alert('حدث خطأ ما');
      }
    }
  }
}
