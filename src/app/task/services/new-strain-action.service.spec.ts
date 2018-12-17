import { TestBed, inject } from '@angular/core/testing';
import { NewStrainActionService } from './new-strain-action.service';

describe('NewStrainActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewStrainActionService]
    });
  });

  it('should be created', inject([NewStrainActionService], (service: NewStrainActionService) => {
    expect(service).toBeTruthy();
  }));
});
