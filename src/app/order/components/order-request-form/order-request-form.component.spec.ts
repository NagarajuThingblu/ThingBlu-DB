import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestFormComponent } from './order-request-form.component';

describe('OrderRequestFormComponent', () => {
  let component: OrderRequestFormComponent;
  let fixture: ComponentFixture<OrderRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
