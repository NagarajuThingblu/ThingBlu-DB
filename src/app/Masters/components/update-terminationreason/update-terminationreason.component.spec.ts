import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTerminationreasonComponent } from './update-terminationreason.component';

describe('UpdateTerminationreasonComponent', () => {
  let component: UpdateTerminationreasonComponent;
  let fixture: ComponentFixture<UpdateTerminationreasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTerminationreasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTerminationreasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
