import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import {
  I18nLocaleService,
  type AppLocale,
} from '../../core/i18n/i18n-locale.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly i18n = inject(I18nLocaleService);
  private readonly transloco = inject(TranslocoService);

  setLocale(lang: AppLocale): void {
    if (this.transloco.getActiveLang() === lang) {
      return;
    }
    this.i18n.setActiveLang(lang);
  }
}
