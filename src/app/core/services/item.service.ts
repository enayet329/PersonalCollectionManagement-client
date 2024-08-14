import { HttpClient, HttpParams } from '@angular/common/http';
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

  getItemById(itemId: string): Observable<Item> {
    const url = this.apiUrl.GET_ITEM_BY_ID;
    const params = new HttpParams().set('id', itemId);
    return this.httpClient.get<Item>(url, { params });
  }
  addItem(collectionId: string): Observable<Item> {
    return this.httpClient.post<Item>(this.apiUrl.ADD_ITEM, { collectionId });
  }
  
}