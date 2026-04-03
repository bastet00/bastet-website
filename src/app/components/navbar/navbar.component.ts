import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  /** Full mailto URL — subject/body must be encodeURIComponent; raw newlines break href. */
  readonly mailToHref =
    'mailto:contact@bastet-app.com' +
    '?subject=' +
    encodeURIComponent('تواصل مع فريق') +
    '&body=' +
    encodeURIComponent(
      ['𓃠 للتواصل مع باستيت', '', 'الموضوع:', '', 'الاسم:', 'رقم الهاتف:'].join(
        '\n',
      ),
    );
}
