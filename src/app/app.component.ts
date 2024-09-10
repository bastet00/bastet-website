import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordDetailComponent } from './word-detail/word-detail.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { LandingComponent } from './landing/landing.component';
import { VideoIntroComponent } from './video-intro/video-intro.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WordDetailComponent,
    CommonModule,
    FormsModule,
    NavbarComponent,
    LandingComponent,
    VideoIntroComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
