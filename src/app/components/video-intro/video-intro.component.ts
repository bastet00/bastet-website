import { Component } from '@angular/core';
import {
  Facebook,
  Instagram,
  LucideAngularModule,
  Youtube,
} from 'lucide-angular';
import { TranslocoModule } from '@ngneat/transloco';

/** Matches `titleColor` in tailwind.config.js for lucide [color] binding */
const ICON_ACCENT = '#f4931e';

@Component({
  selector: 'app-video-intro',
  standalone: true,
  imports: [LucideAngularModule, TranslocoModule],
  templateUrl: './video-intro.component.html',
  styleUrl: './video-intro.component.scss',
})
export class VideoIntroComponent {
  readonly iconColor = ICON_ACCENT;
  readonly instagramIcon = Instagram;
  readonly facebookIcon = Facebook;
  readonly youtubeIcon = Youtube;
}
