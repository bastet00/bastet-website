import { Injectable } from '@angular/core';
import { fromFetch } from 'rxjs/fetch';
import { catchError, EMPTY, from, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LiteralTranslationResults } from '../../dto/literal-translation-results.dto';
import { NotificationService } from '../../components/notification/notification.service';
import { isAbortError } from '../../utils/abort';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class LiteralTranslationService {
  private baseUrl = `${environment.apiUrl}/literal-translation`;
  private abort: AbortController | null = null;
  private callGeneration = 0;

  constructor(
    private notificationService: NotificationService,
    private transloco: TranslocoService,
  ) {}

  /** Invalidate any in-flight `getLiteralTranslation` (e.g. host destroyed). */
  cancelInFlight(): void {
    this.callGeneration++;
    this.abort?.abort();
  }

  getLiteralTranslation(text: string): Observable<LiteralTranslationResults> {
    const id = ++this.callGeneration;
    this.abort?.abort();
    this.abort = new AbortController();
    return fromFetch(`${this.baseUrl}?text=${encodeURIComponent(text)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: this.abort.signal,
    }).pipe(
      switchMap((response: Response) => {
        if (id !== this.callGeneration) {
          return EMPTY;
        }
        if (response.ok) {
          return from(response.json() as Promise<LiteralTranslationResults>);
        }
        if (response.status === 429) {
          if (id !== this.callGeneration) {
            return EMPTY;
          }
          this.notificationService.error(
            this.transloco.translate('toasts.rateLimit'),
            6000,
          );
          return of({ literalTranslation: '', lettersMapper: [] });
        }
        throw new Error('Literal translation request failed');
      }),
      catchError((err) => {
        if (isAbortError(err) || id !== this.callGeneration) {
          return EMPTY;
        }
        console.error('Literal translation error:', err);
        return of({ literalTranslation: '', lettersMapper: [] });
      }),
    );
  }
}
