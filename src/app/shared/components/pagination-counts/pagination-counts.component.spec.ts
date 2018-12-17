import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationCountsComponent } from './pagination-counts.component';

describe('PaginationCountsComponent', () => {
  let component: PaginationCountsComponent;
  let fixture: ComponentFixture<PaginationCountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationCountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
