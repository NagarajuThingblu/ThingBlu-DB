import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantTerminationReasonsComponent } from './plant-termination-reasons.component';

describe('PlantTerminationReasonsComponent', () => {
  let component: PlantTerminationReasonsComponent;
  let fixture: ComponentFixture<PlantTerminationReasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantTerminationReasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantTerminationReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
