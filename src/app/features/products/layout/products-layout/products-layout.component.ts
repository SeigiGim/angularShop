import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-products-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './products-layout.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsLayoutComponent { }
