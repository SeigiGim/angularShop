import { Routes } from '@angular/router';
import { authenticatedGuard } from './auth/guards/authenticated.guard';
import { isAdminGuard } from './auth/guards/is-admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
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
