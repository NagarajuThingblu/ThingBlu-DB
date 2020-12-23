import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpPerformanceDashboardComponent } from './emp-performance-dashboard.component';

describe('EmpPerformanceDashboardComponent', () => {
  let component: EmpPerformanceDashboardComponent;
  let fixture: ComponentFixture<EmpPerformanceDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpPerformanceDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpPerformanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
