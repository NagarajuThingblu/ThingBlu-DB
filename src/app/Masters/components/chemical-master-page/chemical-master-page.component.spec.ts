import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalMasterPageComponent } from './chemical-master-page.component';

describe('ChemicalMasterPageComponent', () => {
  let component: ChemicalMasterPageComponent;
  let fixture: ComponentFixture<ChemicalMasterPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemicalMasterPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
