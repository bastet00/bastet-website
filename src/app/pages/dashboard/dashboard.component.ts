import { Component } from '@angular/core';
import { LoginService } from '../../services/api/login.service';
import { Router, RouterModule } from '@angular/router';
import { LandingBackgroundComponent } from '../../components/landing-background/landing-background.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LandingBackgroundComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  pwd: string = '';
  ngOnInit(): void {
    this.pwd = this.router.url;
    this.loginService.isTrusted$.subscribe((val) => {
      if (!val) {
        this.router.navigateByUrl('/');
      }
    });
  }
}
