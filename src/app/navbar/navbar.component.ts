import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  mailBody = `𓃠 للتواصل مع  باستيت %0A
  %0A
  الموضوع:%0A

  %0A
  الاسم:%0A
  رقم الهاتف:%0A
  `;
}
