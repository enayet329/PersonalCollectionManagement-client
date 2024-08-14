import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CustomFieldValueConstants } from '../constants/constants';
import { CustomFieldValue, CustomFieldValueResponse } from '../model/customFieldValue.model';
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
  
}
