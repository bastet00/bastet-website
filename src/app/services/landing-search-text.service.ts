import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Pushes the home landing text field value so `translation-box` (and others)
 * can show sentence / translation UI without being nested in the input component.
 */
@Injectable({ providedIn: 'root' })
export class LandingSearchTextService {
  private readonly textSubject = new BehaviorSubject<string>('');

  /** Current value from the landing text field. */
  readonly text$ = this.textSubject.asObservable();

  setText(text: string): void {
    this.textSubject.next(text);
  }
}
