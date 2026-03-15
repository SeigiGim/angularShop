import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../interfaces/auth.interfaces';
import { RegisterRequest, SessionUser, UserResponse } from '../interfaces/user.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  private readonly _token = signal<string | null>(localStorage.getItem('token'));
  private readonly _refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));

  private readonly _sessionUserResource = rxResource({
    params: () => this._token(),
    stream: ({ params: token }) => {
      if (!token) return of(null);
      return this.http.get<UserResponse>(`${this.baseUrl}/auth/profile`).pipe(
        map(({ password: _password, ...user }) => user as SessionUser),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
    },
  });

  public readonly sessionUser = computed(() => this._sessionUserResource.value() ?? null);
  public readonly authStatus = computed<AuthStatus>(() => {
    if (this._sessionUserResource.isLoading()) return 'checking';
    return this._sessionUserResource.value() ? 'authenticated' : 'not-authenticated';
  });
  public readonly token = this._token.asReadonly();
  public readonly refreshToken = this._refreshToken.asReadonly();
  public readonly isAdmin = computed(() => this.sessionUser()?.role.includes('admin') ?? false);

  login(loginRequest: LoginRequest): Observable<boolean> {
    const { email, password } = loginRequest;
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      tap(({ access_token, refresh_token }) => this.setTokens(access_token, refresh_token)),
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  register(registerRequest: RegisterRequest): Observable<boolean> {
    const { name, email, password, avatar = 'https://api.escuelajs.co/api/v1/files/f3a5.png' } = registerRequest;
    return this.http.post<UserResponse>(`${this.baseUrl}/users`, { name, email, password, avatar }).pipe(
      map(() => true),
      switchMap(() => this.login({ email, password })),
      catchError(() => of(false))
    );
  }

  refreshAccessToken(): Observable<boolean> {
    const currentRefreshToken = this._refreshToken();
    if (!currentRefreshToken) {
      this.logout();
      return of(false);
    }
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/refresh-token`, {
        refreshToken: currentRefreshToken,
      })
      .pipe(
        tap(({ access_token, refresh_token }) =>
          this.setTokens(access_token, refresh_token)
        ),
        map(() => true),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  logout() {
    this._token.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  private setTokens(token: string, refreshToken: string) {
    this._token.set(token);
    this._refreshToken.set(refreshToken);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }
}
