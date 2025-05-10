import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { environment } from '../../../environments/environment';

interface Category {
  category: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor() {}
  private url = `${environment.apiUrl}/category/`;

  getCategories(): Observable<Category> {
    return fromFetch(`${this.url}`).pipe(
      switchMap(async (response) => {
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error('Failed to fetch category');
        }
      }),
      catchError((err) => {
        console.error(err);
        return of({} as Category);
      }),
    );
  }
}
