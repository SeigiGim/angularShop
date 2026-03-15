import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes')
  },
  {
    path: 'administration',
    loadChildren: () => import('./features/administration/administration.routes')
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
