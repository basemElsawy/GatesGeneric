import { TestBed } from '@angular/core/testing';

import { ControlModelService } from './control-model.service';

describe('ControlModelService', () => {
  let service: ControlModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
