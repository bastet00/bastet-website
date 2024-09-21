import { Injectable } from '@angular/core';

interface WordSuggestionCreationDto {
  Arabic: { Word: string }[];
  Egyptian: { Word: string; Symbol: string }[];
  English: { Word: string }[];
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
