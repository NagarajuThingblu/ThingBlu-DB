import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudPackagingComponent } from './bud-packaging.component';

describe('BudPackagingComponent', () => {
  let component: BudPackagingComponent;
  let fixture: ComponentFixture<BudPackagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudPackagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudPackagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
