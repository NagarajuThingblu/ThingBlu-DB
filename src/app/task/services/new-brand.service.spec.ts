import { TestBed, inject } from '@angular/core/testing';
import { NewBrandActionService } from './new-brand.service';

describe('NewBrandActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewBrandActionService]
    });
  });

  it('should be created', inject([NewBrandActionService], (service: NewBrandActionService) => {
    expect(service).toBeTruthy();
  }));
});
