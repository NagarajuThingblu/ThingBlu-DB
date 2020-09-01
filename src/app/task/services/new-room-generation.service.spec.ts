import { TestBed, inject } from '@angular/core/testing';

import { NewRoomGenerationService } from './new-room-generation.service';

describe('NewRoomGenerationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewRoomGenerationService]
    });
  });

  it('should be created', inject([NewRoomGenerationService], (service: NewRoomGenerationService) => {
    expect(service).toBeTruthy();
  }));
});
