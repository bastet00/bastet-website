import { Component } from '@angular/core';
import { StaticComponent } from './static/static.component';
import { UserInputComponent } from './user-input/user-input.component';
import { TranslationBoxComponent } from './translation-box/translation-box.component';
import { SuspendComponent } from '../suspend/suspend.component';
import { WordDetailComponent } from '../word-detail/word-detail.component';
import { LandingBackgroundComponent } from '../landing-background/landing-background.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    StaticComponent,
    UserInputComponent,
    TranslationBoxComponent,
    SuspendComponent,
    WordDetailComponent,
    LandingBackgroundComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
