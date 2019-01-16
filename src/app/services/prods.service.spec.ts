import { TestBed } from '@angular/core/testing';

import { ProdsService } from './prods.service';

describe('ProdsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProdsService = TestBed.get(ProdsService);
    expect(service).toBeTruthy();
  });
});
