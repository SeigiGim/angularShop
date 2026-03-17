import { Routes } from '@angular/router';
import { isAdminGuard } from './core/guards/is-admin.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
    canMatch: [authenticatedGuard]
  },
  {
    path: 'administration',
    loadChildren: () => import('./features/administration/administration.routes'),
    canMatch: [isAdminGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes')
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];
