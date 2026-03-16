import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { PATHS } from '../../../core/app-paths';

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
  isAdmin = computed(() => this.authService.isAdmin());
  authStatus = computed(() => this.authService.authStatus());

  logout() {
    this.authService.logout();
    this.router.navigate([PATHS.AUTH.LOGIN]);
  }
}
