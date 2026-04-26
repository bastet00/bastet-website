import { Injectable } from '@angular/core';
import { fromFetch } from 'rxjs/fetch';
import { catchError, EMPTY, from, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SentenceTranslationResponse } from '../../dto/sentence-translation.dto';
import { NotificationService } from '../../components/notification/notification.service';
import { TRANSLATOR_RATE_LIMIT_MESSAGE } from '../../constants/translator-rate-limit.message';
import { isAbortError } from '../../utils/abort';

@Injectable({
  providedIn: 'root',
})
export class SentenceTranslationService {
  private baseUrl = `${environment.apiUrl}/api/v1/translate`;
  private abort: AbortController | null = null;
  private callGeneration = 0;

  constructor(private notificationService: NotificationService) {}

  /** Invalidate any in-flight `getSentenceTranslation` (e.g. host destroyed). */
  cancelInFlight(): void {
    this.callGeneration++;
    this.abort?.abort();
  }

  getSentenceTranslation(
    text: string,
    language: string,
  ): Observable<SentenceTranslationResponse> {
    const id = ++this.callGeneration;
    this.abort?.abort();
    this.abort = new AbortController();
    return fromFetch(
      `${this.baseUrl}?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(language)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: this.abort.signal,
      },
    ).pipe(
      switchMap((response: Response) => {
        if (id !== this.callGeneration) {
          return EMPTY;
        }
        if (response.ok) {
          return from(response.json() as Promise<SentenceTranslationResponse>);
        }
        if (response.status === 429) {
          if (id !== this.callGeneration) {
            return EMPTY;
          }
          this.notificationService.error(TRANSLATOR_RATE_LIMIT_MESSAGE, 6000);
          return of(this.emptyRes());
        }
        throw new Error('Sentence translation request failed');
      }),
      catchError((err) => {
        if (isAbortError(err) || id !== this.callGeneration) {
          return EMPTY;
        }
        console.error('Sentence translation error:', err);
        return of(this.emptyRes());
      }),
    );
  }

  private emptyRes(): SentenceTranslationResponse {
    return { translation: '', translationUsingArabicLetters: '' };
  }
}
