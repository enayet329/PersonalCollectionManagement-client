import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddCollectionRequest, Collection } from '../model/collection.mode.';
import { CollectionConstants } from '../constants/constants';
import { Categories } from '../model/categories.model';
import { ResponseModel } from '../model/response.model';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private apiUrl = CollectionConstants.API_ENDPOINTS;

  httpClient = inject(HttpClient);

  getLatestCollections(): Observable<Collection[]> {
    return this.httpClient.get<Collection[]>(this.apiUrl.GET_LARGEST_COLLECTIONS);
  };

  getCollections(): Observable<Collection[]> {
    return this.httpClient.get<Collection[]>(this.apiUrl.GET_COLLECTIONS);
  };

  getCollectionById(id: string): Observable<Collection> {
    const url = this.apiUrl.GET_COLLECTION_BY_ID;
    const params = { id: id };
    return this.httpClient.get<Collection>(url, { params });
  };
  
  getCollectionByUserId(userId: string): Observable<Collection[]> {
    const url = this.apiUrl.GET_COLLECTIONS_BY_USER_ID;
    const params = { userId: userId };
    return this.httpClient.get<Collection[]>(url, { params });
  }
  
  addCollection(collection: AddCollectionRequest): Observable<Collection>{
    const url = this.apiUrl.ADD_COLLECTION;
    return this.httpClient.post<Collection>(url, collection);
  }

  getCategories(): Observable<Categories[]> {
    return this.httpClient.get<Categories[]>(this.apiUrl.GET_COLLECTION_CATEGORY);
  }

  deleteCollection(id: string): Observable<ResponseModel> {
    const url = this.apiUrl.DELETE_COLLECTION;
    const params = { id: id };
    return this.httpClient.delete<ResponseModel>(url, { params });
  }
}
