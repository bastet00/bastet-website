import { Injectable } from '@angular/core';
import { fromFetch } from 'rxjs/fetch';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LiteralTranslationResults } from '../../dto/literal-translation-results.dto';
import { NotificationService } from '../../components/notification/notification.service';
import { TRANSLATOR_RATE_LIMIT_MESSAGE } from '../../constants/translator-rate-limit.message';

@Injectable({
  providedIn: 'root',
})
export class LiteralTranslationService {
  private baseUrl = `${environment.apiUrl}/literal-translation`;

  constructor(private notificationService: NotificationService) {}

  getLiteralTranslation(text: string): Observable<LiteralTranslationResults> {
    return fromFetch(`${this.baseUrl}?text=${encodeURIComponent(text)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      switchMap((response: Response) => {
        if (response.ok) {
          return response.json() as Promise<LiteralTranslationResults>;
        }
        if (response.status === 429) {
          this.notificationService.error(TRANSLATOR_RATE_LIMIT_MESSAGE, 6000);
          return of({ literalTranslation: '', lettersMapper: [] });
        }
        throw new Error('Literal translation request failed');
      }),
      catchError((err) => {
        console.error('Literal translation error:', err);
        return of({ literalTranslation: '', lettersMapper: [] });
      }),
    );
  }
}
