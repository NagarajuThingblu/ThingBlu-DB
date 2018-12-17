import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotEntryFormComponent } from './lot-entry-form.component';

describe('LotEntryFormComponent', () => {
  let component: LotEntryFormComponent;
  let fixture: ComponentFixture<LotEntryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotEntryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
