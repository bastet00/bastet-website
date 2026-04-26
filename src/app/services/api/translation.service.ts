import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
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
import { isAbortError } from '../../utils/abort';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private url = `${environment.apiUrl}/word`;
  private dataSubject = new BehaviorSubject<TranslationRes[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private emptyResSubject = new BehaviorSubject<boolean>(false);
  private searchAbort: AbortController | null = null;
  /** Bumps on each new `translation` call; stale in-flight work must not touch subjects. */
  private searchGeneration = 0;
  data$ = this.dataSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  emptyRes$ = this.emptyResSubject.asObservable();

  constructor(private notificationService: NotificationService) {}

  translation(fromLang: string, word: string): Observable<TranslationRes[]> {
    const id = ++this.searchGeneration;
    this.searchAbort?.abort();
    this.searchAbort = new AbortController();
    const signal = this.searchAbort.signal;
    this.loadingSubject.next(true);
    return fromFetch(`${this.url}/search?lang=${fromLang}&word=${word}`, {
      signal,
      headers: {
        'Content-Type': 'application/json',
      },
    }).pipe(
      switchMap((response) => {
        if (id !== this.searchGeneration) {
          return EMPTY;
        }
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
          if (id !== this.searchGeneration) {
            return EMPTY;
          }
          this.notificationService.error(TRANSLATOR_RATE_LIMIT_MESSAGE, 6000);
          return of({
            kind: 'rateLimited' as const,
            data: [] as TranslationRes[],
          });
        }

        return throwError(() => new Error('Failed to fetch translation'));
      }),

      tap((payload) => {
        if (id !== this.searchGeneration) {
          return;
        }
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
        if (isAbortError(err) || id !== this.searchGeneration) {
          return EMPTY;
        }
        console.error('Error during translation:', err);
        this.dataSubject.next([]);
        this.emptyResSubject.next(false);
        this.loadingSubject.next(false);
        return of([] as TranslationRes[]);
      }),
    );
  }

  /** Bumps the generation, aborts in-flight `translation()`, and clears loading. Does not clear results. */
  cancelInFlightSearch(): void {
    this.searchGeneration++;
    this.searchAbort?.abort();
    this.loadingSubject.next(false);
  }

  setNull() {
    this.searchGeneration++;
    this.searchAbort?.abort();
    this.loadingSubject.next(false);
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
