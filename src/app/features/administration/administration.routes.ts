import { Routes } from "@angular/router";
import { AdministrationLayoutComponent } from "./layout/administration-layout/administration-layout.component";
import { AdminDashboardPageComponent } from "./pages/admin-dashboard-page/admin-dashboard-page.component";
const administrationRoutes: Routes = [
  {
    path: '',
    component: AdministrationLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardPageComponent
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
]

export default administrationRoutes;
