import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

export const AUTH_KEY = 'authCred';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private url = `https://bastet-server-ef94bb4e91eb.herokuapp.com/login?password=`;
  private isTrustedSubjects: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );
  isTrusted$ = this.isTrustedSubjects.asObservable();
  constructor() {
    this.prevLogin();
  }

  private prevLogin() {
    if (localStorage.getItem(AUTH_KEY)) {
      this.isTrustedSubjects.next(true);
    } else {
      this.isTrustedSubjects.next(false);
    }
  }

  private setLogin(pass: string) {
    localStorage.setItem(AUTH_KEY, pass);
  }

  login(pass: string): Observable<boolean> {
    return fromFetch(`${this.url}${pass}`).pipe(
      switchMap((response) => {
        if (response.ok) {
          this.isTrustedSubjects.next(true);
          this.setLogin(pass);
          return of(true);
        } else {
          this.isTrustedSubjects.next(false);
          return of(false);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        this.isTrustedSubjects.next(false);
        return of(false);
      }),
    );
  }
}
