import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-landing-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-background.component.html',
  styleUrl: './landing-background.component.scss',
})
export class LandingBackgroundComponent {
  @Input() fullHieght: string = 'h-auto';
}
