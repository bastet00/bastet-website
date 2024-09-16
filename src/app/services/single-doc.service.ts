import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { AUTH_KEY } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class SingleDocService {
  private url = 'https://bastet-server-ef94bb4e91eb.herokuapp.com/';
  constructor() {}

  delete(id: string): Observable<Response> {
    const key = localStorage.getItem(AUTH_KEY);

    if (!key) {
      return throwError(() => new Error('No auth key found'));
    }

    return fromFetch(`${this.url}${id}`, {
      method: 'DELETE',
      headers: { Authorization: key },
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
