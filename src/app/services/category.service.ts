import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Word } from '../dto/word.dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWordsByCategory(category: string): Observable<Word[]> {
    return this.http.get<Word[]>(
      `${this.apiUrl}/api/v1/category/${category}/words`,
    );
  }
}
