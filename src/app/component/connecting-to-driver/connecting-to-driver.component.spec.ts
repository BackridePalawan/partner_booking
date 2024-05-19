import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectingToDriverComponent } from './connecting-to-driver.component';

describe('ConnectingToDriverComponent', () => {
  let component: ConnectingToDriverComponent;
  let fixture: ComponentFixture<ConnectingToDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectingToDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectingToDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
