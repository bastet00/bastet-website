import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
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

  constructor() {}

  toSymbol(sy: string) {
    const symbol = '0x' + sy;
    const entity = parseInt(symbol, 16);
    return `&#${entity};`;
  }

  translation(from: string, word: string): Observable<TranslationRes[]> {
    const controller = new AbortController();
    const signal = controller.signal;
    this.loadingSubject.next(true);
    return fromFetch(`${this.url}/search?lang=${from}&word=${word}`, {
      signal,
      headers: {
        'Content-Type': 'application/json',
      },
    }).pipe(
      switchMap((response): Promise<TranslationRes[]> => {
        this.loadingSubject.next(true);

        if (response.ok) {
          this.loadingSubject.next(false);
          return response.json();
        } else {
          this.loadingSubject.next(false);
          throw new Error('Failed to fetch translation');
        }
      }),

      tap((translation: TranslationRes[]) => {
        if (translation.length === 0) {
          this.emptyResSubject.next(true);
        } else {
          this.emptyResSubject.next(false);
        }

        this.dataSubject.next(translation);
      }),

      catchError((err) => {
        console.error('Error during translation:', err);
        return of([]);
      }),
    );
  }

  setNull() {
    this.dataSubject.next([]);
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
