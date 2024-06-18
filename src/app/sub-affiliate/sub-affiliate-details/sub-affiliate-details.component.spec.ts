import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAffiliateDetailsComponent } from './sub-affiliate-details.component';

describe('SubAffiliateDetailsComponent', () => {
  let component: SubAffiliateDetailsComponent;
  let fixture: ComponentFixture<SubAffiliateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubAffiliateDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubAffiliateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
