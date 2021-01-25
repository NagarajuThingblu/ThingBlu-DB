import { TestBed, inject } from '@angular/core/testing';

import { NewFieldGenerationService } from './new-field-generation.service';


describe('NewRoomGenerationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewFieldGenerationService]
    });
  });

  it('should be created', inject([NewFieldGenerationService], (service: NewFieldGenerationService) => {
    expect(service).toBeTruthy();
  }));
});
