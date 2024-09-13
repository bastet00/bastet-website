import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private url = `http://localhost:3000/login?password=`;
  private isTrustedSubjects: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );
  private localKey = 'isAuthBefore';
  isTrusted$ = this.isTrustedSubjects.asObservable();
  constructor() {
    this.prevLogin();
  }

  private prevLogin() {
    if (localStorage.getItem(this.localKey)) {
      this.isTrustedSubjects.next(true);
    } else {
      this.isTrustedSubjects.next(false);
    }
  }

  private setLogin() {
    localStorage.setItem(this.localKey, 'true');
  }

  login(pass: string): Observable<boolean> {
    return fromFetch(`${this.url}${pass}`).pipe(
      switchMap((response) => {
        if (response.ok) {
          this.isTrustedSubjects.next(true);
          this.setLogin();
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
