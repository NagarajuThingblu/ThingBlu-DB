import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotNoteComponent } from './lot-note.component';

describe('LotNoteComponent', () => {
  let component: LotNoteComponent;
  let fixture: ComponentFixture<LotNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
