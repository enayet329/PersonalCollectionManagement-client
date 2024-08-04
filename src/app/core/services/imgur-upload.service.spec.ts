import { TestBed } from '@angular/core/testing';

import { ImgurUploadService } from './imgur-upload.service';

describe('ImgurUploadService', () => {
  let service: ImgurUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgurUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
