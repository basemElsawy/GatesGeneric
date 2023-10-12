/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CanavasService } from './canavas.service';

describe('Service: Canavas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanavasService]
    });
  });

  it('should ...', inject([CanavasService], (service: CanavasService) => {
    expect(service).toBeTruthy();
  }));
});
