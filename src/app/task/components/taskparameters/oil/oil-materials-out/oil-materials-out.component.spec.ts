import { OilMaterialsOutComponent } from './oil-materials-out.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('OilMaterialsOutComponent', () => {
  let component: OilMaterialsOutComponent;
  let fixture: ComponentFixture<OilMaterialsOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OilMaterialsOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OilMaterialsOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
