import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersourceComponent } from './othersource.component';

describe('OthersourceComponent', () => {
  let component: OthersourceComponent;
  let fixture: ComponentFixture<OthersourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
