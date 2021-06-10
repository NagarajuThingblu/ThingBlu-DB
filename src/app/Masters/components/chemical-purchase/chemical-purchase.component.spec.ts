import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalPurchaseComponent } from './chemical-purchase.component';

describe('ChemicalPurchaseComponent', () => {
  let component: ChemicalPurchaseComponent;
  let fixture: ComponentFixture<ChemicalPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemicalPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
