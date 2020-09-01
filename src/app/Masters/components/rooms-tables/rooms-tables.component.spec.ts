import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsTablesComponent } from './rooms-tables.component';

describe('RoomsTablesComponent', () => {
  let component: RoomsTablesComponent;
  let fixture: ComponentFixture<RoomsTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomsTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
