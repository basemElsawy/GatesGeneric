import { TestBed } from '@angular/core/testing';

import { MultiModelService } from './multi-model.service';

describe('MultiModelService', () => {
  let service: MultiModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
