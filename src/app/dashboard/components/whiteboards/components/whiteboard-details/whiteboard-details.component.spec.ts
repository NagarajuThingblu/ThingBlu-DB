import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteboardDetailsComponent } from './whiteboard-details.component';

describe('WhiteboardDetailsComponent', () => {
  let component: WhiteboardDetailsComponent;
  let fixture: ComponentFixture<WhiteboardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhiteboardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
