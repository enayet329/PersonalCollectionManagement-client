import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserConstants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private apiUrl = UserConstants.API_ENDPOINTS.REFRESH_TOKEN;

  http = inject(HttpClient);

  getRefreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('token');
  
    const refreshRequest = {
      accessToken,
      refreshToken
    };
  
    return this.http.post<any>(this.apiUrl, refreshRequest).pipe(
      tap(response => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      })
    );
  }

  
  
}
