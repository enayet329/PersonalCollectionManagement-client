import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentConstants } from '../constants/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = CommentConstants.API_ENDPOINTS;

  constructor(private httpClient: HttpClient) {}

  getCommetsByItemId(itemId: string): Observable<Comment[]> {
    const url = this.apiUrl.GET_COMMENTS_BY_ITEM_ID;
    const params = { itemId: itemId };
    return this.httpClient.get<Comment[]>(url, { params: params });
  }
}
