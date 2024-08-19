import { inject, Injectable } from '@angular/core';
import { TagConstants } from '../constants/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddTagRequest, AddTagResponse } from '../model/tag.model';
import { Observable } from 'rxjs';
import { ResponseModel } from '../model/response.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private api = TagConstants.API_ENDPOINTS;

  http = inject(HttpClient);

  getAllTags() {
    return this.http.get<AddTagResponse[]>(this.api.GET_TAGS);
  }

  addTags(tags: AddTagRequest[]): Observable<ResponseModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain',
    });

    return this.http.post<ResponseModel>(this.api.ADD_TAG, tags, { headers });
  }

  getTagsByItemId(itemId: string): Observable<AddTagResponse[]> {

    const url = `${this.api.GET_TAGS_BY_ITEM_ID}?itemId=${itemId}`
    return this.http.get<AddTagResponse[]>(url);
  }

  updateTag(itemId: string, payload: any): Observable<any> {
    const url = `${this.api.UPDATE_TAG}/${itemId}/tag`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });

    return this.http.put(url, payload, { headers });
  }

}
