import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { AUTH_KEY } from './login.service';
import { TranslationRes, TranslationResToView } from '../landing/interface';

@Injectable({
  providedIn: 'root',
})
export class SingleDocService {
  private url = 'https://bastet-server-ef94bb4e91eb.herokuapp.com/';
  constructor() {}

  private key = localStorage.getItem(AUTH_KEY);

  delete(id: string): Observable<Response> {
    if (!this.key) {
      return throwError(() => new Error('No auth key found'));
    }

    return fromFetch(`${this.url}${id}`, {
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

  hexToSymbol(hex: string) {
    const codePoint = parseInt(hex, 16);
    return String.fromCodePoint(codePoint);
  }

  put(
    target: TranslationRes,
    newObj: TranslationResToView,
  ): Observable<Response> {
    if (!this.key) {
      return throwError(() => new Error('No auth key found'));
    }

    target.Arabic = newObj.Arabic.split('-').map((word) => ({
      Word: word.trim(),
    }));
    target.Egyptian[0].Word = newObj.Egyptian;

    const htmlEntityLength = 8;

    if (newObj.Symbol.length === htmlEntityLength) {
      if (newObj.hexSym) {
        target.Egyptian[0].Symbol = this.hexToSymbol(newObj.hexSym);
      }
    } else {
      target.Egyptian[0].Symbol = newObj.Symbol;
    }

    return fromFetch(`${this.url}${newObj.id}`, {
      method: 'PUT',
      headers: {
        Authorization: this.key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(target),
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
}
