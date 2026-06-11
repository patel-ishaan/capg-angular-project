import { TestBed } from '@angular/core/testing';

import { PolicySearch } from './policy-search';

describe('PolicySearch', () => {
  let service: PolicySearch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicySearch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
