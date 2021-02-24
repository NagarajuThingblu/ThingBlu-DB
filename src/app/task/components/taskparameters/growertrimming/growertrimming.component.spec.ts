import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowertrimmingComponent } from './growertrimming.component';

describe('GrowertrimmingComponent', () => {
  let component: GrowertrimmingComponent;
  let fixture: ComponentFixture<GrowertrimmingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowertrimmingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowertrimmingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
