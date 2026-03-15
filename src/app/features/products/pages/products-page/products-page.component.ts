import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';

const MOCK_IMAGE = 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp';

@Component({
  selector: 'app-products-page',
  imports: [],
  templateUrl: './products-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent {
  private productsService = inject(ProductsService);

  productsResource = rxResource({
    stream: () => this.productsService.getProducts({ limit: 9, offset: 0 }),
  });
}

