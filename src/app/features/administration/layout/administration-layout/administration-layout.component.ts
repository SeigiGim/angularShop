import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-administration-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './administration-layout.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationLayoutComponent { }
