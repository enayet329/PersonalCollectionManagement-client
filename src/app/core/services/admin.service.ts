import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../model/user.model';
import { AdminConstants, ItemConstants } from '../constants/constants';
import { ThemeService } from './theme.service';
import { ResponseModel } from '../model/response.model';

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
    const url = `${this.apiurl.DELETE_USER}?id=${userId}`;
    return this.http.delete(url);
  }

  deleteItem(itemId: string): Observable<any> {
    return this.http.delete(this.itemUrl.DELETE_ITEM + itemId);
  }

  upgradeToAdmin(id: string): Observable<ResponseModel> {
    const url = `${this.apiurl.UPGRADE_ADMIN_ROLE}?id=${id}`;
    return this.http.put<ResponseModel>(url, null);
  }

  downgradeToUser(id: string): Observable<ResponseModel> {
    const url = `${this.apiurl.DOWNGRADE_ADMIN_ROLE}?id=${id}`;
    return this.http.put<ResponseModel>(url, null);
  }

  blockUser(id: string): Observable<ResponseModel> {
    const url = `${this.apiurl.BLOCK_USER}?id=${id}`;
    return this.http.put<ResponseModel>(url, null);
  }

  unblockUser(id: string): Observable<ResponseModel> {
    const url = `${this.apiurl.UNBLOCK_USER}?id=${id}`;
    return this.http.put<ResponseModel>(url, null);
  }
}
//https://www.collectionapp.somee.com/api/v1/admin/user/upgrade/admin?id=1a69c657-9fa1-469d-1c96-08dcc15051d4
//https://collectionapp.somee.com/api/v1/user/upgrade/admin?id=1a69c657-9fa1-469d-1c96-08dcc15051d4