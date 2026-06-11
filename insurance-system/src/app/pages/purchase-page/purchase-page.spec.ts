import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePage } from './purchase-page';

describe('PurchasePage', () => {
  let component: PurchasePage;
  let fixture: ComponentFixture<PurchasePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasePage],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchasePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
