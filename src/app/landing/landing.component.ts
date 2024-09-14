import { Component } from '@angular/core';
import { StaticComponent } from './static/static.component';
import { LangSwitcherComponent } from './lang-switcher/lang-switcher.component';
import { UserInputComponent } from './user-input/user-input.component';
import { TranslationBoxComponent } from './translation-box/translation-box.component';
import { SuspendComponent } from '../suspend/suspend.component';
import { WordDetailComponent } from '../word-detail/word-detail.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    StaticComponent,
    LangSwitcherComponent,
    UserInputComponent,
    TranslationBoxComponent,
    SuspendComponent,
    WordDetailComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
