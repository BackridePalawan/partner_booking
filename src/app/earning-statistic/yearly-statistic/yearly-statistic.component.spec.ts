import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyStatisticComponent } from './yearly-statistic.component';

describe('YearlyStatisticComponent', () => {
  let component: YearlyStatisticComponent;
  let fixture: ComponentFixture<YearlyStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearlyStatisticComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YearlyStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
