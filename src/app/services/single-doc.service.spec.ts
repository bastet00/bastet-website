import { TestBed } from '@angular/core/testing';

import { SingleDocService } from './single-doc.service';

describe('SingleDocService', () => {
  let service: SingleDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
