import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharactersCountComponent } from './characters-count.component';

describe('CharactersCountComponent', () => {
  let component: CharactersCountComponent;
  let fixture: ComponentFixture<CharactersCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharactersCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharactersCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
