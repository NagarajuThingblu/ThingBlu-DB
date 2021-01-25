import { TestBed, inject } from '@angular/core/testing';
import { NewSectionDetailsActionService } from './add-section-details.service';

describe('NewProductTypeDetailsActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewSectionDetailsActionService]
    });
  });

  it('should be created', inject([NewSectionDetailsActionService], (service: NewSectionDetailsActionService) => {
    expect(service).toBeTruthy();
  }));
});
