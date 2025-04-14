import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-add-word',
  standalone: true,
  imports: [],
  templateUrl: './admin-add-word.component.html',
  styleUrl: './admin-add-word.component.scss',
})
export class AdminAddWordComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginService.isTrusted$.subscribe((val) => {
      if (!val) {
        this.router.navigateByUrl('/');
      }
    });
  }
}
