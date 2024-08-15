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

}
