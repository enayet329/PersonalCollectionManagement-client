import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../model/item.model';
import { ItemConstants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = ItemConstants.API_ENDPOINTS;

  constructor(private httpClient: HttpClient) {}

  search(query: string) {
    const searchUrl = `${this.apiUrl.SEARCH_ITEMS}?query=${encodeURIComponent(query)}`;
    return this.httpClient.get<Item[]>(searchUrl);
  }
}
