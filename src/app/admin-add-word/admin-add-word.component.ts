import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { LoginService } from '../services/api/login.service';
import { Router } from '@angular/router';
import { LandingBackgroundComponent } from '../landing-background/landing-background.component';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AddWordFormValues,
  WordAdminService,
} from '../services/api/admin-word.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../services/api/category.service';
import { ArrowDown, CircleX, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-add-word',
  standalone: true,
  imports: [
    LandingBackgroundComponent,
    ReactiveFormsModule,
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './admin-add-word.component.html',
  styleUrl: './admin-add-word.component.scss',
})
export class AdminAddWordComponent {
  readonly arrowDown = ArrowDown;
  readonly circleX = CircleX;

  @ViewChildren('categoryBtn') categoryHolder!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private wordService: WordAdminService,
    private categoryService: CategoryService,
  ) {}

  isSubmitted = false;
  isValidWord = false;
  categoryList: string[] = [];
  categoryStash: string[] = [];
  dropdownMenuState = false;
  invalidFormSubmit = false;
  fb = new FormBuilder();

  toggleDropdown() {
    this.dropdownMenuState = !this.dropdownMenuState;
  }

  get alertMessage(): string {
    if (this.isValidWord) {
      return 'تمت الاضافه بنجاح';
    } else if (this.invalidFormSubmit) {
      return 'حدث خطأ اثناء الاضافه';
    } else {
      return 'اضافه';
    }
  }
  wordForm = this.fb.group({
    hiero: ['', Validators.required],
    resources: ['', Validators.required],
    symbol: ['', Validators.required],
    transliteration: ['', Validators.required],
    gardiner: ['', Validators.required],
    arabic: ['', Validators.required],
    english: '',
    category: this.fb.array([]),
  });

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

  get category(): FormArray {
    return this.wordForm.get('category') as FormArray;
  }

  formToWordObj(): AddWordFormValues {
    return {
      resources: [
        this.wordForm.value.resources,
        `Bastet ${new Date().getFullYear()}`,
      ] as string[],
      egyptian: [
        {
          word: this.wordForm.value.hiero as string,
          symbol: this.wordForm.value.symbol as string,
          transliteration: this.wordForm.value.transliteration as string,
          hieroglyphics: this.wordForm.value.gardiner?.split(',') as string[],
        },
      ],
      arabic: (this.wordForm.value.arabic as string).split(',').map((w) => {
        return { word: w };
      }),

      ...(this.wordForm.value.english && {
        english: (this.wordForm.value.english as string)
          .split(',')
          .map((w) => ({ word: w })),
      }),

      ...(this.wordForm.value.category && {
        category: this.wordForm.value.category,
      }),
    };
  }

  resetFormAfterValidSubmit() {
    this.categoryStash = [];
    this.isValidWord = true;
    this.isSubmitted = false;
    this.dropdownMenuState = false;
    this.wordForm.reset();
    this.wordForm.setControl('category', this.fb.array([]));
    this.invalidFormSubmit = false;
  }

  submitWord() {
    this.isSubmitted = true;

    if (!this.wordForm.invalid) {
      const word = this.formToWordObj();
      this.wordService.post(word).subscribe((res) => {
        if (res.ok) {
          this.resetFormAfterValidSubmit();
          setTimeout(() => {
            this.isValidWord = false;
          }, 1500);
        } else {
          this.invalidFormSubmit = true;
        }
      });
    }
  }

  onCategoryClicked(categoryClicked: string) {
    if (this.categoryStash.includes(categoryClicked)) {
      this.removeCategory(categoryClicked);
    } else {
      this.addCategory(categoryClicked);
    }
  }

  addCategory(category: string) {
    if (!this.categoryStash.includes(category)) {
      this.categoryStash.push(category);
    }

    this.syncCategoryFormArray();
  }

  syncCategoryFormArray() {
    const categoryAsArray = this.fb.array([]);
    this.categoryStash.forEach((value) => {
      if (value) {
        categoryAsArray.push(this.fb.control(value));
      }
    });
    this.wordForm.setControl('category', categoryAsArray);
  }

  removeCategory(category: string) {
    this.categoryStash = this.categoryStash.filter((item) => item !== category);
    this.syncCategoryFormArray();
  }
}
