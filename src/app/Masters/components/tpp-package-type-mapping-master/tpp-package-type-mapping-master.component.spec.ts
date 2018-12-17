import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TppPackageTypeMappingMasterComponent } from './tpp-package-type-mapping-master.component';

describe('TppPackageTypeMappingMasterComponent', () => {
  let component: TppPackageTypeMappingMasterComponent;
  let fixture: ComponentFixture<TppPackageTypeMappingMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TppPackageTypeMappingMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TppPackageTypeMappingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
