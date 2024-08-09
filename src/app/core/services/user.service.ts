
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../model/response.model';
import { UserConstants } from '../constants/constants';

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
}
