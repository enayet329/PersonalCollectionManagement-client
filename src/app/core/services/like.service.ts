import { Injectable } from '@angular/core';
import { LikeConstants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LikeResponseModel } from '../model/response.model';

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

  toggleLike(data: { userId: string; itemId: string }): Observable<any> {
    const url = this.apiUrl.TOGGLE_LIKE;
    return this.httpClient.post(url, data);
  }

  isItemLiked(userId: string, itemId: string): Observable<LikeResponseModel> {
    const url = this.apiUrl.GET_LIKE_BY_USER_ID;
    const body = {
      userId: userId,
      itemId: itemId,
    };
    return this.httpClient.post<LikeResponseModel>(url, body);
  }
}
