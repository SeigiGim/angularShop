import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  private _products = signal<Product[]>([]);
  private _product = signal<Product | null>(null);
  private _productsByCategory = signal<Product[]>([]);
  readonly products = this._products.asReadonly();
  readonly product = this._product.asReadonly();
  readonly productsByCategory = this._productsByCategory.asReadonly();

  getProducts(options: Options): Observable<Product[]> {
    const { limit = 9, offset = 0, gender = '' } = options;
    return this.http.get<Product[]>(`${this.baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender,
      }
    });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`).pipe(
      tap(product => this._product.set(product))
    )
  }

  getProductsByCategoryId(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/?categoryId=${categoryId}`).pipe(
      tap(products => this._productsByCategory.set(products))
    )
  }

  getProductsByCategorySlug(categorySlug: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/?categorySlug=${categorySlug}`).pipe(
      tap(products => this._productsByCategory.set(products))
    )
  }
}

