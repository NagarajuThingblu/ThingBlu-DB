import { TestBed, inject } from '@angular/core/testing';
import { NewLabelDetailsActionService } from './add-label-details.service';

describe('NewProductTypeDetailsActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewLabelDetailsActionService]
    });
  });

  it('should be created', inject([NewLabelDetailsActionService], (service: NewLabelDetailsActionService) => {
    expect(service).toBeTruthy();
  }));
});
