import { Injectable } from '@angular/core';

interface WordSuggestionCreationDto {
  arabic: { word: string }[];
  egyptian: { word: string; symbol: string }[];
  english: { word: string }[];
}
@Injectable({
  providedIn: 'root',
})
export class SingleDocService {
  private url = 'https://bastet-server-ef94bb4e91eb.herokuapp.com/';
  constructor() {}

  create(wordSuggestionCreationDto: WordSuggestionCreationDto) {
    //TODO: add api request
    return wordSuggestionCreationDto;
  }
}
