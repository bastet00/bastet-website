import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LandingBackgroundComponent } from '../landing-background/landing-background.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
    console.log(this.wordForm.value);
    console.log(this.wordForm.invalid);
  }
}
