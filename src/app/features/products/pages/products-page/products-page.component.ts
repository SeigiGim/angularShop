import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductsService } from '../../../../data/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CardSkeletonComponent } from '../../../../shared/components/card-skeleton/card-skeleton.component';

@Component({
  selector: 'app-products-page',
  imports: [ProductCardComponent, CardSkeletonComponent],
  templateUrl: './products-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent {
  private readonly productsService = inject(ProductsService);

  readonly productsResource = rxResource({
    stream: () => this.productsService.getProducts(),
  });
}
