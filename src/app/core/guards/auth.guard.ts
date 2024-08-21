import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { JwtDecoderService } from '../services/jwt-decoder.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private jwtDecoder: JwtDecoderService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token && this.jwtDecoder.getIsAdminFromToken(token)) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
