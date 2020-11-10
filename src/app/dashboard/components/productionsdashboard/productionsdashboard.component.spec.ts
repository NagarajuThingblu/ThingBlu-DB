import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionsdashboardComponent } from './productionsdashboard.component';

describe('ProductionsdashboardComponent', () => {
  let component: ProductionsdashboardComponent;
  let fixture: ComponentFixture<ProductionsdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionsdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionsdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
