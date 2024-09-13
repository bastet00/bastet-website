import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}
  isTrusted: boolean = false;

  private goTo() {
    this.router.navigateByUrl('/admin');
  }

  invalidPass = false;

  ngOnInit(): void {
    this.loginService.isTrusted$.subscribe(
      (isTrusted) => (this.isTrusted = isTrusted),
    );

    if (this.isTrusted) {
      this.goTo();
    }
  }

  loginForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
  });

  submitCreds() {
    const password = this.loginForm.value.password ?? '';
    this.loginService.login(password).subscribe((trusted) => {
      if (trusted) {
        this.goTo();
      } else this.invalidPass = true;
    });
  }
}
