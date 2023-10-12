/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TitleServiceService } from './title-service.service';

describe('Service: TitleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleServiceService]
    });
  });

  it('should ...', inject([TitleServiceService], (service: TitleServiceService) => {
    expect(service).toBeTruthy();
  }));
});
