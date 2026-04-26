import { Component } from '@angular/core';

@Component({
  selector: 'app-static',
  standalone: true,
  imports: [],
  templateUrl: './static.component.html',
  styleUrl: './static.component.scss',
})
export class StaticComponent {
  /** Learn Hieroglyphs (Patreon) */
  readonly patreonUrl =
    'https://patreon.com/learnhiero?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink';
}
