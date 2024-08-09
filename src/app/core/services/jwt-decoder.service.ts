import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtDecoderService {
  constructor() { }

  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserIdFromToken(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null : null;
  }

  getUsernameFromToken(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null : null;
  }

  getEmailFromToken(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null : null;
  }

  getIsAdminFromToken(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin' : false;
  }

  getIsBlockedFromToken(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['isBlocked'] === 'True' : false;
  }

  getPreferredLanguageFromToken(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['PreferredLanguage'] || null : null;
  }

  getPreferredThemeDarkFromToken(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['PreferredThemeDark'] === 'true' : false;
  }

  getExpirationFromToken(token: string): number | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['exp'] || null : null;
  }

  isTokenExpired(token: string): boolean {
    const expiration = this.getExpirationFromToken(token);
    if (!expiration) return true;
    return (Math.floor((new Date).getTime() / 1000)) >= expiration;
  }
}