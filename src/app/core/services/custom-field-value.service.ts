import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CustomFieldValueConstants } from '../constants/constants';
import { CustomFieldValue, CustomFieldValueResponse, updateCustomFieldValueRequest } from '../model/customFieldValue.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomFieldValueService {

  private apiurl = CustomFieldValueConstants.API_ENDPOINTS;

  http = inject(HttpClient);

  addCustomFieldValue(customFiledValue: CustomFieldValue[]): Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
    }); 
    return this.http.post(this.apiurl.ADD_CUSTOM_FIELD_VALUE, customFiledValue, {headers});
  }

  getCustomFieldValueByItemId(itemId: string): Observable<CustomFieldValueResponse[]> {
    const params = { itemId: itemId };
    return this.http.get<CustomFieldValueResponse[]>(this.apiurl.GET_CUSTOM_FIELD_VALUES_BY_ITEM_ID, { params });
  }

  updateCustomFieldValues(itemId: string, customFieldValues: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiurl.UPDATE_CUSTOM_FIELD_VALUE}/${itemId}`, customFieldValues);
  }

  deleteCustomFieldValue(customFieldValueId: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
    }); 
    return this.http.delete(this.apiurl.DELETE_CUSTOM_FIELD_VALUE + customFieldValueId, {headers});
  }
  
}
