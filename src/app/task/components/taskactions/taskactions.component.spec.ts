import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskactionsComponent } from './taskactions.component';

describe('TaskactionsComponent', () => {
  let component: TaskactionsComponent;
  let fixture: ComponentFixture<TaskactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
