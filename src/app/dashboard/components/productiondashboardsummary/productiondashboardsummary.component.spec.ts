import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductiondashboardsummaryComponent } from './productiondashboardsummary.component';

describe('ProductiondashboardsummaryComponent', () => {
  let component: ProductiondashboardsummaryComponent;
  let fixture: ComponentFixture<ProductiondashboardsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductiondashboardsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductiondashboardsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
