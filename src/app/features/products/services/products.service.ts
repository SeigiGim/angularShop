import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

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
}
