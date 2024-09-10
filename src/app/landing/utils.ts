import { fromFetch } from 'rxjs/fetch';
import { TranslationRes } from './interface';
import { catchError, Observable, of, switchMap } from 'rxjs';

export function symbolTranslator(sy: string) {
  const symbol = '0x' + sy;
  const entity = parseInt(symbol, 16);
  return `&#${entity};`;
}

export function translation(
  from: string,
  word: string,
): Observable<TranslationRes[]> {
  const url = 'https://bastet-server-ef94bb4e91eb.herokuapp.com/search';
  const controller = new AbortController();
  const signal = controller.signal;

  return fromFetch(`${url}?lang=${from}&word=${word}`, {
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  }).pipe(
    switchMap((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch translation');
      }
    }),
    catchError((err) => {
      console.error('Error during translation:', err);
      return of([]);
    }),
  );
}
