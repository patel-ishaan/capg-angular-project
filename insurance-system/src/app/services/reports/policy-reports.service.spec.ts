import { TestBed } from '@angular/core/testing';

import { PolicyReportsService } from './policy-reports.service.js';

describe('PolicyReportsServiceTs', () => {
  let service: PolicyReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
