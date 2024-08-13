import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CustomField } from '../model/customField.model';
import { CustomFieldConstants } from '../constants/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomFieldService {
  private apiUrl = CustomFieldConstants.API_ENDPOINTS;
  httpClient = inject(HttpClient);
  addCustomField(customField: CustomField[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
    });

    return this.httpClient.post<any>(this.apiUrl.ADD_CUSTOM_FIELD, customField, { headers });
  }

  updateCustomField(customField: CustomField[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
    });

    return this.httpClient.put<any>(this.apiUrl.UPDATE_CUSTOM_FIELD, customField, { headers });
  }
}