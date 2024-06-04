import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAffiliateComponent } from './sub-affiliate.component';

describe('SubAffiliateComponent', () => {
  let component: SubAffiliateComponent;
  let fixture: ComponentFixture<SubAffiliateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubAffiliateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
