import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProductsService } from '../../../../data/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CardSkeletonComponent } from '../../../../shared/components/card-skeleton/card-skeleton.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-page',
  imports: [ProductCardComponent, CardSkeletonComponent],
  templateUrl: './products-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);

  private readonly queryParams = toSignal(this.route.queryParams, { initialValue: {} as Record<string, string> });

  readonly productsFilter = computed(() => {
    const title = this.queryParams()['title'] as string | undefined;
    return title ? { title } : {};
  });

  readonly productsResource = rxResource({
    params: () => this.productsFilter(),
    stream: ({ params }) => this.productsService.getProducts(params),
  });
}
