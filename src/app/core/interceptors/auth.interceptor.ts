import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
let refreshSubject$ = new BehaviorSubject<string | null>(null);

function addAuthHeader(req: HttpRequest<unknown>, token: string | null) {
  return token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
}

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const authReq = addAuthHeader(req, authService.token());

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse && error.status === 401)) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        // Otra petición ya está refrescando: esperar a que termine y reintentar
        return refreshSubject$.pipe(
          filter((token): token is string => token !== null),
          take(1),
          switchMap((token) => next(addAuthHeader(req, token)))
        );
      }

      isRefreshing = true;
      refreshSubject$ = new BehaviorSubject<string | null>(null);

      return authService.refreshAccessToken().pipe(
        switchMap((success) => {
          isRefreshing = false;
          if (success) {
            const newToken = authService.token()!;
            refreshSubject$.next(newToken);
            return next(addAuthHeader(req, newToken));
          }
          return throwError(() => error);
        }),
        catchError((err) => {
          isRefreshing = false;
          refreshSubject$.error(err);
          return throwError(() => err);
        })
      );
    })
  );
}
