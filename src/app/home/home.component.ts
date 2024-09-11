import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LandingComponent } from '../landing/landing.component';
import { VideoIntroComponent } from '../video-intro/video-intro.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, LandingComponent, VideoIntroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
