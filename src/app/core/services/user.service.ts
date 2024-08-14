
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../model/response.model';
import { UserConstants } from '../constants/constants';
import { UserModel } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = UserConstants.API_ENDPOINTS;

  constructor(private httpClient: HttpClient) {}

  registerUser(user: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl.REGISTER, user);
  }

  loginUser(user: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl.LOGIN, user);
  }

  updateUser(account: UserModel): Observable<ResponseModel> {
    const headers = new HttpHeaders({
      'Accept': '*/*',
      'Content-Type': 'application/json'
    });

    return this.httpClient.put<ResponseModel>(this.apiUrl.UPDATE_USER, account, { headers });
  }

  updateTheme(userId: string, theme: boolean): Observable<any> {
    const url = `${this.apiUrl.UPDATE_THEME}`;
    const params = { userId, theme: theme.toString() };
  
    return this.httpClient.put<any>(url, null, { params });
  }
  

  updateLanguage(language: string): Observable<any> {
    return this.httpClient.put<any>(this.apiUrl.UPDATE_LANGUAGE, language);
  }

  getUserById(userId: string): Observable<UserModel> {
    const url = this.apiUrl.GET_USER_BY_ID;
    const params = { id: userId };
    return this.httpClient.get<UserModel>(url, { params });
  }

}
