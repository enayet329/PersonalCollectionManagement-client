import { Injectable } from '@angular/core';
import { LikeConstants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private apiUrl = LikeConstants.API_ENDPOINTS;

  constructor(private httpClient: HttpClient) {}

  getLikesByItemId(itemId: string): Observable<any> {
    const url = this.apiUrl.GET_LIKE_BY_ITEM_ID;
    const params = { itemId: itemId };
    return this.httpClient.get(url, { params });
  }
}
