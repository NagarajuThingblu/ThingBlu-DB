import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D8DistillateComponent } from './d8-distillate.component';

describe('D8DistillateComponent', () => {
  let component: D8DistillateComponent;
  let fixture: ComponentFixture<D8DistillateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D8DistillateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D8DistillateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
