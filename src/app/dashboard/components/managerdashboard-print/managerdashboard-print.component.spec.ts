import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerdashboardPrintComponent } from './managerdashboard-print.component';

describe('ManagerdashboardPrintComponent', () => {
  let component: ManagerdashboardPrintComponent;
  let fixture: ComponentFixture<ManagerdashboardPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerdashboardPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerdashboardPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
