import { TestBed } from '@angular/core/testing';

import { CustomFieldValueService } from './custom-field-value.service';

describe('CustomFieldValueService', () => {
  let service: CustomFieldValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomFieldValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
