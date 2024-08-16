import { Component, Input } from '@angular/core';
import { Word } from '../dto/word.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'word-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-detail.component.html',
  styleUrl: './word-detail.component.scss',
})
export class WordDetailComponent {
  @Input() word: Word | undefined;
}
