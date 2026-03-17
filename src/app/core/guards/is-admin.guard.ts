import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanMatchFn } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const isAdminGuard: CanMatchFn = () => {
  const authService = inject(AuthService);

  return toObservable(authService.authStatus).pipe(
    filter(status => status !== 'checking'),
    take(1),
    map(() => authService.isAdmin())
  );
};
