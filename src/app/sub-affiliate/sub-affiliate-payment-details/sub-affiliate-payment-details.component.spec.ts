import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAffiliatePaymentDetailsComponent } from './sub-affiliate-payment-details.component';

describe('SubAffiliatePaymentDetailsComponent', () => {
  let component: SubAffiliatePaymentDetailsComponent;
  let fixture: ComponentFixture<SubAffiliatePaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubAffiliatePaymentDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubAffiliatePaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
