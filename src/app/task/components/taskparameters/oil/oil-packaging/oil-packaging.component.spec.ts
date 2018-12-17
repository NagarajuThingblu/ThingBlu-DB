import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OilPackagingComponent } from './oil-packaging.component';

describe('OilPackagingComponent', () => {
  let component: OilPackagingComponent;
  let fixture: ComponentFixture<OilPackagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OilPackagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OilPackagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
