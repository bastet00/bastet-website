import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { TranslationRes } from '../../pages/home/landing/interface';
import { Word } from '../../dto/word.dto';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../components/notification/notification.service';
import { TRANSLATOR_RATE_LIMIT_MESSAGE } from '../../constants/translator-rate-limit.message';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private url = `${environment.apiUrl}/word`;
  private dataSubject = new BehaviorSubject<TranslationRes[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private emptyResSubject = new BehaviorSubject<boolean>(false);
  data$ = this.dataSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  emptyRes$ = this.emptyResSubject.asObservable();

  constructor(private notificationService: NotificationService) {}

  translation(fromLang: string, word: string): Observable<TranslationRes[]> {
    const controller = new AbortController();
    const signal = controller.signal;
    this.loadingSubject.next(true);
    return fromFetch(`${this.url}/search?lang=${fromLang}&word=${word}`, {
      signal,
      headers: {
        'Content-Type': 'application/json',
      },
    }).pipe(
      switchMap((response) => {
        this.loadingSubject.next(true);

        if (response.ok) {
          this.loadingSubject.next(false);
          return from(response.json() as Promise<TranslationRes[]>).pipe(
            map(
              (data: TranslationRes[]) =>
                ({ kind: 'ok' as const, data }) as const,
            ),
          );
        }

        this.loadingSubject.next(false);
        if (response.status === 429) {
          this.notificationService.error(TRANSLATOR_RATE_LIMIT_MESSAGE, 6000);
          return of({
            kind: 'rateLimited' as const,
            data: [] as TranslationRes[],
          });
        }

        return throwError(() => new Error('Failed to fetch translation'));
      }),

      tap((payload) => {
        this.dataSubject.next(payload.data);
        if (payload.kind === 'rateLimited') {
          this.emptyResSubject.next(false);
        } else if (payload.data.length === 0) {
          this.emptyResSubject.next(true);
        } else {
          this.emptyResSubject.next(false);
        }
      }),

      map((payload) => payload.data),

      catchError((err) => {
        console.error('Error during translation:', err);
        this.dataSubject.next([]);
        this.emptyResSubject.next(false);
        return of([] as TranslationRes[]);
      }),
    );
  }

  setNull() {
    this.dataSubject.next([]);
    this.emptyResSubject.next(false);
  }

  async getOne(id: string): Promise<Word> {
    const call = fromFetch(`${this.url}/${id}`).pipe(
      switchMap(async (response) => {
        if (response.ok) {
          return await response.json();
        }
        throw throwError(() => new Error());
      }),
      catchError(() => {
        throw new Error('failed to fetch resource');
      }),
    );

    return firstValueFrom(call);
  }
}
