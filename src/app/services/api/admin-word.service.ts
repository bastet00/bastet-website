import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { AUTH_KEY } from './login.service';
import { TranslationResToView } from '../../pages/home/landing/interface';
import { HttpClient } from '@angular/common/http';
import { Word } from '../../dto/word.dto';
import { environment } from '../../../environments/environment';

export interface AdminWordListApiResponse {
  count: number;
  totalPages: number;
  page: number;
  perPage: number;
  items: Word[];
}

export interface AddWordFormValues {
  english?: { word: string }[] | undefined;
  resources: string[];
  egyptian: {
    transliteration: string;
    hieroglyphics: string[];
  }[];
  arabic: {
    word: string;
  }[];
}

export interface AdminWordViewList extends AdminWordListApiResponse {
  itemsForView: TranslationResToView[];
}

@Injectable({
  providedIn: 'root',
})
export class WordAdminService {
  private url = `${environment.apiUrl}/admin/word`;
  constructor(private http: HttpClient) {}

  private key = localStorage.getItem(AUTH_KEY) as string;

  getWords(
    word: string,
    lang: string,
    options: { page: number; perPage: number } = { page: 1, perPage: 25 },
  ): Observable<AdminWordViewList> {
    if (!this.key) {
      return throwError(() => new Error('No auth key found'));
    }
    return this.http
      .get<AdminWordListApiResponse>(this.url, {
        params: { lang, word, ...options },
        headers: { Authorization: this.key },
      })
      .pipe(
        map((results) => {
          return {
            count: results.count,
            totalPages: results.totalPages,
            page: results.page,
            perPage: results.perPage,
            itemsForView: results.items.map((word) => {
              return {
                id: word.id,
                arabic: word.arabic.map((arabic) => arabic.word).join(' - '),
                egyptian: word.egyptian[0].word,
                ...(word.english && {
                  english: word.english
                    .map((english) => english.word)
                    .join(' - '),
                }),
                ...(word.category && {
                  category: word.category,
                }),
              } as TranslationResToView;
            }),
            items: results.items,
          };
        }),
      );
  }
  delete(id: string): Observable<Response> {
    if (!this.key) {
      return throwError(() => new Error('No auth key found'));
    }

    return fromFetch(`${this.url}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: this.key },
    }).pipe(
      switchMap((response) => {
        if (response.ok) {
          return of(response);
        }
        return throwError(() => new Error(`Error: ${response.text()}`));
      }),
      catchError((error) => {
        return throwError(() => new Error(error));
      }),
    );
  }

  put(target: Word, newObj: TranslationResToView): Observable<Response> {
    if (!this.key) {
      return throwError(() => new Error('No auth key found'));
    }

    target.arabic = newObj.arabic.split('-').map((word) => ({ word: word }));
    if (newObj.english) {
      target.english = newObj.english.split('-').map((word) => ({
        word: word,
      }));
    }

    target.arabic = newObj.arabic.split('-').map((word) => ({
      word: word.trim(),
    }));
    target.egyptian[0].word = newObj.egyptian;

    const egyptianForApi = target.egyptian.map((e) => {
      const { symbol: _omit, ...rest } = e as typeof e & { symbol?: string };
      return rest;
    });
    const payload = { ...target, egyptian: egyptianForApi };

    return fromFetch(`${this.url}/${newObj.id}`, {
      method: 'PUT',
      headers: {
        Authorization: this.key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).pipe(
      switchMap((response) => {
        if (response.ok) {
          return of(response);
        }
        return throwError(() => new Error(`Error: ${response.text()}`));
      }),
      catchError((error) => {
        return throwError(() => new Error(error));
      }),
    );
  }

  post(word: AddWordFormValues) {
    return fromFetch(this.url, {
      method: 'POST',
      headers: {
        Authorization: this.key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
  }
}
