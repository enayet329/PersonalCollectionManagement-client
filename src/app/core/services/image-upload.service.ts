import { Injectable } from '@angular/core';
import * as cloudinaryCore from 'cloudinary-core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryUploadService {
  private cloudinary: any;

  constructor() {
    this.cloudinary = new cloudinaryCore.Cloudinary({
      cloud_name: environment.cloudName
    });
  }

  uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.uploadPreset);

    return new Promise((resolve, reject) => {
      fetch(`https://api.cloudinary.com/v1_1/${environment.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject('Image upload failed');
        }
      })
      .catch(error => reject(error));
    });
  }
}
