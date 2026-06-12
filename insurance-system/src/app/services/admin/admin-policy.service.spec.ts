import { TestBed } from '@angular/core/testing';

// import { AdminPolicyService } from './admin-policy.service.js';
import { AdminPolicyService } from './admin-policy.service.js';

describe('AdminPolicyServiceTs', () => {
  let service: AdminPolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
