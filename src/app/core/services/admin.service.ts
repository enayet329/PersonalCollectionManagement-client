import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../model/user.model';
import { AdminConstants, ItemConstants } from '../constants/constants';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiurl = AdminConstants.API_ENDPOINTS;
  private itemUrl = ItemConstants.API_ENDPOINTS;
  http = inject(HttpClient);

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiurl.GET_USERS);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(this.apiurl.DELETE_USER + userId);
  }

  deleteItem(itemId: string): Observable<any> {
    return this.http.delete(this.itemUrl.DELETE_ITEM + itemId);
  }
}
