import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointsCreationComponent } from './joints-creation.component';

describe('JointsCreationComponent', () => {
  let component: JointsCreationComponent;
  let fixture: ComponentFixture<JointsCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointsCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointsCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
