import { TestBed } from '@angular/core/testing';

import { PolicyCatalog } from './policy-catalog';

describe('PolicyCatalog', () => {
  let service: PolicyCatalog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyCatalog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
