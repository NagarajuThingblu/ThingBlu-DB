import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuckingComponent } from './bucking.component';

describe('BuckingComponent', () => {
  let component: BuckingComponent;
  let fixture: ComponentFixture<BuckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
