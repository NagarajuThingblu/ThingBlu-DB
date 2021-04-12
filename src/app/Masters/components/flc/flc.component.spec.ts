import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlcComponent } from './flc.component';

describe('FlcComponent', () => {
  let component: FlcComponent;
  let fixture: ComponentFixture<FlcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
