import { TestBed } from '@angular/core/testing';

import { WordAdminService } from './admin-word.service';

describe('SingleDocService', () => {
  let service: WordAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
