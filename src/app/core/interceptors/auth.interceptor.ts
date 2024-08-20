import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  const token = localStorage.getItem('token');

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {

        return authService.getRefreshToken().pipe(
          switchMap((newTokens: any) => {

            localStorage.setItem('token', newTokens.accessToken);
            localStorage.setItem('refreshToken', newTokens.refreshToken);


            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newTokens.accessToken}`,
              },
            });

            return next(newReq);
          }),
          catchError((refreshError) => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            console.error('Refresh token failed', refreshError);
            return throwError(refreshError);
          })
        );
      }
      return throwError(error);
    })
  );
};
