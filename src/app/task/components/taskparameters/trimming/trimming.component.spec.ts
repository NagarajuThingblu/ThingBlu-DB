import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrimmingComponent } from './trimming.component';

describe('TrimmingComponent', () => {
  let component: TrimmingComponent;
  let fixture: ComponentFixture<TrimmingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrimmingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrimmingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
