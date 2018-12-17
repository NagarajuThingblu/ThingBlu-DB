import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteboardsComponent } from './whiteboards.component';

describe('WhiteboardsComponent', () => {
  let component: WhiteboardsComponent;
  let fixture: ComponentFixture<WhiteboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhiteboardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
