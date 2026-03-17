import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PATHS } from '../../../core/app-paths';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected readonly PATHS = PATHS;
  sessionUser = computed(() => this.authService.sessionUser());
  authStatus = computed(() => this.authService.authStatus());

  logout() {
    this.authService.logout();
    this.router.navigate([PATHS.AUTH.LOGIN]);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.router.navigate([PATHS.PRODUCTS.ROOT], {
      queryParams: value ? { title: value } : {},
    });
  }
}
