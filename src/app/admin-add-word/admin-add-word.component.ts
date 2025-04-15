import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LandingBackgroundComponent } from '../landing-background/landing-background.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WordAdminService } from '../services/api/admin-word.service';

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
    symbol: ['', Validators.required],
    arabic: ['', Validators.required],
    comment: '',
  });

  ngOnInit(): void {
    this.loginService.isTrusted$.subscribe((val) => {
      if (!val) {
        this.router.navigateByUrl('/');
      }
    });
  }

  submitWord() {
    this.isSubmitted = true;
    if (!this.wordForm.invalid) {
      const word = {
        hiero: this.wordForm.value.hiero as string,
        arabic: this.wordForm.value.arabic as string,
        symbol: this.wordForm.value.symbol as string,
        comment: (this.wordForm.value.comment ?? '') as string,
      };
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
