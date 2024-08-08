import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection } from '../model/collection.mode.';
import { CollectionConstants } from '../constants/constants';

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
}
