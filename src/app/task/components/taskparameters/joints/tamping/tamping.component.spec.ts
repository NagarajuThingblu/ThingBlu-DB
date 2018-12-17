import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TampingComponent } from './tamping.component';

describe('TampingComponent', () => {
  let component: TampingComponent;
  let fixture: ComponentFixture<TampingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TampingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TampingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
