import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoriesComponent } from './payment-histories.component';

describe('PaymentHistoriesComponent', () => {
  let component: PaymentHistoriesComponent;
  let fixture: ComponentFixture<PaymentHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentHistoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
