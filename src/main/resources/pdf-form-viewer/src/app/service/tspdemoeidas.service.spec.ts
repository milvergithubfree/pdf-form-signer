import { TestBed } from '@angular/core/testing';

import { TspdemoeidasService } from './tspdemoeidas.service';

describe('TspdemoeidasService', () => {
  let service: TspdemoeidasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TspdemoeidasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
