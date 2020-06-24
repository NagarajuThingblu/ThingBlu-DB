import { TestBed, inject } from '@angular/core/testing';

import { NewTaskActionService } from './new-task-action.service';

describe('NewTaskActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewTaskActionService]
    });
  });

  it('should be created', inject([NewTaskActionService], (service: NewTaskActionService) => {
    expect(service).toBeTruthy();
  }));
});
