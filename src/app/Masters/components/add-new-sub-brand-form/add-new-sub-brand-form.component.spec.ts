import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSubBrandFormComponent } from './add-new-sub-brand-form.component';

describe('AddNewSubBrandFormComponent', () => {
  let component: AddNewSubBrandFormComponent;
  let fixture: ComponentFixture<AddNewSubBrandFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewSubBrandFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSubBrandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
