import { TestBed } from '@angular/core/testing';

import { CloudinaryUploadService } from './image-upload.service';

describe('ImgurUploadService', () => {
  let service: CloudinaryUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinaryUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
