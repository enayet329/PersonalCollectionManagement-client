import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CustomField, CustomFieldResponse, updateCustomFieldRequest } from '../model/customField.model';
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

  updateCustomField(collectionId: string, customField: updateCustomFieldRequest[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
    });
    const url = `${this.apiUrl.UPDATE_CUSTOM_FIELD}/${collectionId}`;
    return this.httpClient.put<any>(url, customField, { headers });
  }

  getCustomFieldsByCollectionId(collectionId: string): Observable<CustomFieldResponse[]> {
    const url = `${this.apiUrl.GET_CUSTOM_FIELDS_BY_COLLECTION_ID}?collectionId=${collectionId}`;
    return this.httpClient.get<CustomFieldResponse[]>(url);
  }
  
}