import { TestBed, inject } from '@angular/core/testing';

import { GrowerDetailsActionService } from './grower-details-action.service';

describe('GrowerDetailsActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrowerDetailsActionService]
    });
  });

  it('should be created', inject([GrowerDetailsActionService], (service: GrowerDetailsActionService) => {
    expect(service).toBeTruthy();
  }));
});
