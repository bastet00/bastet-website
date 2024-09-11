import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required]),
  });

  submitCreds() {
    const user = this.loginForm.value.user ?? '';
    const password = this.loginForm.value.password ?? '';

    console.log('User:', user);
    console.log('Password:', password);
  }
}
