import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LandingBackgroundComponent } from '../landing-background/landing-background.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AddWordFormValues,
  WordAdminService,
} from '../services/api/admin-word.service';

@Component({
  selector: 'app-admin-add-word',
  standalone: true,
  imports: [LandingBackgroundComponent, ReactiveFormsModule],
  templateUrl: './admin-add-word.component.html',
  styleUrl: './admin-add-word.component.scss',
})
export class AdminAddWordComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private wordService: WordAdminService,
  ) {}
  isSubmitted = false;

  wordForm = new FormBuilder().group({
    hiero: ['', Validators.required],
    resources: ['', Validators.required],
    symbol: ['', Validators.required],
    transliteration: ['', Validators.required],
    gardiner: ['', Validators.required],
    arabic: ['', Validators.required],
    english: '', // optional
  });

  ngOnInit(): void {
    this.loginService.isTrusted$.subscribe((val) => {
      if (!val) {
        this.router.navigateByUrl('/');
      }
    });
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
        english: (this.wordForm.value.english as string).split(',').map((w) => {
          return { word: w };
        }),
      }),
    };
  }

  submitWord() {
    this.isSubmitted = true;

    if (!this.wordForm.invalid) {
      const word = this.formToWordObj();
      console.log(word);

      this.wordService.post(word).subscribe((res) => {
        if (res.ok) {
          console.log('Handle created doc');
        } else {
          console.log('Handle error while createing doc');
        }
      });
    }
  }
}
