import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningStatisticComponent } from './earning-statistic.component';

describe('EarningStatisticComponent', () => {
  let component: EarningStatisticComponent;
  let fixture: ComponentFixture<EarningStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EarningStatisticComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EarningStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
