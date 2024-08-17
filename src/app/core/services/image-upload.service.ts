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
      cloud_name: environment.cludeName
    });
  }

  uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.uploadPreset);

    return new Promise((resolve, reject) => {
      fetch(`https://api.cloudinary.com/v1_1/${environment.cludeName}/image/upload`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => resolve(data.secure_url))
      .catch(error => reject(error));
    });
  }

  deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`https://api.cloudinary.com/v1_1/${environment.cludeName}/image/destroy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          public_id: publicId,
          api_key: environment.apiKey,
          api_secret: environment.apiSecret,
          invalidate: true
        })
      })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
    });
  }
}
