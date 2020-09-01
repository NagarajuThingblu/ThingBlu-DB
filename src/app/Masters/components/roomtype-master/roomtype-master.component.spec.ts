import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomtypeMasterComponent } from './roomtype-master.component';

describe('RoomtypeMasterComponent', () => {
  let component: RoomtypeMasterComponent;
  let fixture: ComponentFixture<RoomtypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomtypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomtypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
