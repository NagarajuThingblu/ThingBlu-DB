import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrainMasterComponent } from './strain-master.component';

describe('StrainMasterComponent', () => {
  let component: StrainMasterComponent;
  let fixture: ComponentFixture<StrainMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrainMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrainMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
