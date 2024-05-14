import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyStatisticComponent } from './weekly-statistic.component';

describe('WeeklyStatisticComponent', () => {
  let component: WeeklyStatisticComponent;
  let fixture: ComponentFixture<WeeklyStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeeklyStatisticComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeeklyStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
