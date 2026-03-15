import { Routes } from "@angular/router";
import { ProductsLayoutComponent } from "./layout/products-layout/products-layout.component";
import { ProductPageComponent } from "./pages/product-page/product-page.component";
import { ProductsPageComponent } from "./pages/products-page/products-page.component";

const productsRoutes: Routes = [
  {
    path: '',
    component: ProductsLayoutComponent,
    children: [
      {
        path: 'product/:id',
        component: ProductPageComponent
      },
      {
        path: '',
        component: ProductsPageComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
]

export default productsRoutes;
