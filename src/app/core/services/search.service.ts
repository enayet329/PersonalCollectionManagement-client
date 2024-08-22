import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../model/item.model';
import { ItemConstants, SearchConstants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = SearchConstants.API_ENDPOINTS;

  constructor(private httpClient: HttpClient) {}

  search(query: string) {
    const searchUrl = `${this.apiUrl.FULL_TEXT_SEARCH}?query=${encodeURIComponent(query)}`;
    return this.httpClient.get<Item[]>(searchUrl);
  }
}
