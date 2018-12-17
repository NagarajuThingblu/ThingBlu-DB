import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrindingComponent } from './grinding.component';

describe('GrindingComponent', () => {
  let component: GrindingComponent;
  let fixture: ComponentFixture<GrindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
