import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Product } from '../../../../data/interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  product = input<Product>();
}
