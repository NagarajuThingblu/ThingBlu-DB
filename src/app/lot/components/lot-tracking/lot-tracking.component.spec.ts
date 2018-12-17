import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotTrackingComponent } from './lot-tracking.component';

describe('LotTrackingComponent', () => {
  let component: LotTrackingComponent;
  let fixture: ComponentFixture<LotTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
