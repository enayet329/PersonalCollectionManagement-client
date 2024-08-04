import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '';
  private authToken = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  get token() {
    return this.authToken.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(tap((response: any) => {
        this.authToken.next(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshtoken', response.refreshtoken)
      }));
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { username, password });
  }

  logout() {
    this.authToken.next(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.authToken.getValue()}`);
  }
}
