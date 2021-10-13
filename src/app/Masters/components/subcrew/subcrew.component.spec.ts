import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcrewComponent } from './subcrew.component';

describe('SubcrewComponent', () => {
  let component: SubcrewComponent;
  let fixture: ComponentFixture<SubcrewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcrewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcrewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
