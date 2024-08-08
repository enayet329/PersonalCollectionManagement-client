import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemConstants } from '../constants/constants';
import { Item } from '../model/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = ItemConstants.API_ENDPOINTS.GET_RECENT_ITEMS;

  constructor(private httpClient: HttpClient) {}

  getRecentItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.apiUrl);
  }
}