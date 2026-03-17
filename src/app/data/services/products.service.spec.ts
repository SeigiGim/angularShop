import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should send every defined filter as query params', () => {
    const service = TestBed.inject(ProductsService);
    const httpTesting = TestBed.inject(HttpTestingController);

    service
      .getProducts({
        title: 'Generic',
        price: 100,
        price_min: 50,
        price_max: 150,
        categoryId: 1,
        categorySlug: 'clothes',
        limit: 12,
        offset: 24,
      })
      .subscribe();

    const request = httpTesting.expectOne(
      (httpRequest) =>
        httpRequest.method === 'GET' && httpRequest.url === `${environment.baseUrl}/products`
    );

    expect(request.request.params.get('title')).toBe('Generic');
    expect(request.request.params.get('price')).toBe('100');
    expect(request.request.params.get('price_min')).toBe('50');
    expect(request.request.params.get('price_max')).toBe('150');
    expect(request.request.params.get('categoryId')).toBe('1');
    expect(request.request.params.get('categorySlug')).toBe('clothes');
    expect(request.request.params.get('limit')).toBe('12');
    expect(request.request.params.get('offset')).toBe('24');

    request.flush([]);
  });

  it('should only send default pagination when optional filters are missing', () => {
    const service = TestBed.inject(ProductsService);
    const httpTesting = TestBed.inject(HttpTestingController);

    service.getProducts({}).subscribe();

    const request = httpTesting.expectOne(
      (httpRequest) =>
        httpRequest.method === 'GET' && httpRequest.url === `${environment.baseUrl}/products`
    );

    expect(request.request.params.get('limit')).toBe('9');
    expect(request.request.params.get('offset')).toBe('0');
    expect(request.request.params.has('title')).toBe(false);
    expect(request.request.params.has('price')).toBe(false);
    expect(request.request.params.has('price_min')).toBe(false);
    expect(request.request.params.has('price_max')).toBe(false);
    expect(request.request.params.has('categoryId')).toBe(false);
    expect(request.request.params.has('categorySlug')).toBe(false);

    request.flush([]);
  });
});
