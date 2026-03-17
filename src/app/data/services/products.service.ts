import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsFilter } from '../interfaces/product.interface';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getProducts(productsFilter: ProductsFilter = {}): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`, {
      params: { limit: 9, offset: 0, ...productsFilter },
    });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }
}

