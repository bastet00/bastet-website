import { Component } from '@angular/core';
import { StaticComponent } from './static/static.component';
import { UserInputComponent } from './user-input/user-input.component';
import { TranslationBoxComponent } from './translation-box/translation-box.component';
import { LandingBackgroundComponent } from '../landing-background/landing-background.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    StaticComponent,
    UserInputComponent,
    TranslationBoxComponent,
    LandingBackgroundComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
