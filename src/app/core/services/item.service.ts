import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemConstants } from '../constants/constants';
import { Item } from '../model/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = ItemConstants.API_ENDPOINTS;

  constructor(private httpClient: HttpClient) {}

  getRecentItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.apiUrl.GET_RECENT_ITEMS);
  }

  getItemByCollectionId(collectionId: string): Observable<Item[]> {
    const url = this.apiUrl.GET_ITEMS_BY_COLLECTION_ID;
    const params = { collectionId: collectionId };
    return this.httpClient.get<Item[]>(url, { params: params });
  }
}