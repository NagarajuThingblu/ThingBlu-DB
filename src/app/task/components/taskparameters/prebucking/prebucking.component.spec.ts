import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebuckingComponent } from './prebucking.component';

describe('PrebuckingComponent', () => {
  let component: PrebuckingComponent;
  let fixture: ComponentFixture<PrebuckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrebuckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrebuckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
