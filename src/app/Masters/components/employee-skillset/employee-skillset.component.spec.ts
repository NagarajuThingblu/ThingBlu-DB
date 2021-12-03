import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSkillsetComponent } from './employee-skillset.component';

describe('EmployeeSkillsetComponent', () => {
  let component: EmployeeSkillsetComponent;
  let fixture: ComponentFixture<EmployeeSkillsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSkillsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSkillsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
