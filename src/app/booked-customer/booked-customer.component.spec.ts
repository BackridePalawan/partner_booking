import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedCustomerComponent } from './booked-customer.component';

describe('BookedCustomerComponent', () => {
  let component: BookedCustomerComponent;
  let fixture: ComponentFixture<BookedCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookedCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookedCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
