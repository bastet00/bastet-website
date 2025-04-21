import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

interface Category {
  category: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor() {}
  url = 'https://bastet-server-ef94bb4e91eb.herokuapp.com/api/category/';

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
