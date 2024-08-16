import { Injectable } from '@angular/core';
import { WordList } from './dto/word.dto';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  readonly baseUrl = 'https://angular.io/assets/images/tutorials/faa';

  protected words: WordList = [
    {
      id: 'b210174d-c88e-4760-97a5-5ecd27f4d2d8',
      Arabic: [
        {
          Word: 'ماما',
        },
      ],
      Egyptian: [
        {
          Word: 'موت',
          Symbol: '00013150',
        },
      ],
    },
    {
      id: '2670ece7-abe0-49f1-b5ce-a6bffcdc67da',
      Arabic: [
        {
          Word: 'امرأة',
        },
        {
          Word: 'امراه',
        },
        {
          Word: 'ست',
        },
      ],
      Egyptian: [
        {
          Word: 'موت',
          Symbol: '00013050',
        },
      ],
    },
  ];

  getWords(): WordList {
    return this.words;
  }

}
