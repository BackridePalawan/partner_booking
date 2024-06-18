import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadLinePaymentComponent } from './dead-line-payment.component';

describe('DeadLinePaymentComponent', () => {
  let component: DeadLinePaymentComponent;
  let fixture: ComponentFixture<DeadLinePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeadLinePaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeadLinePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
