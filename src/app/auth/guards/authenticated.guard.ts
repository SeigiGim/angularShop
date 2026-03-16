import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { PATHS } from '../../core/app-paths';

export const authenticatedGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.authStatus).pipe(
    filter(status => status !== 'checking'),
    take(1),
    map(status =>
      status === 'not-authenticated'
        ? true
        : router.parseUrl(`/${PATHS.PRODUCTS.ROOT}`)
    )
  );
};
