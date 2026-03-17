import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService refresh token flow', () => {
    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
    });

    afterEach(() => {
        const httpTesting = TestBed.inject(HttpTestingController);
        httpTesting.verify();
        localStorage.clear();
        vi.restoreAllMocks();
    });

    const setup = () => ({
        service: TestBed.inject(AuthService),
        httpTesting: TestBed.inject(HttpTestingController),
    });

    it('should return false when there is no refresh token', () => {
        const { service, httpTesting } = setup();

        let result: boolean | undefined;
        service.refreshAccessToken().subscribe((value) => {
            result = value;
        });

        expect(result).toBe(false);
        httpTesting.expectNone(`${environment.baseUrl}/auth/refresh-token`);
    });

    it('should refresh tokens and persist them on success', () => {
        localStorage.setItem('token', 'old-access-token');
        localStorage.setItem('refreshToken', 'old-refresh-token');
        const { service, httpTesting } = setup();

        let result: boolean | undefined;
        service.refreshAccessToken().subscribe((value) => {
            result = value;
        });

        const request = httpTesting.expectOne(`${environment.baseUrl}/auth/refresh-token`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual({ refreshToken: 'old-refresh-token' });

        request.flush({
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token',
        });

        expect(result).toBe(true);
        expect(service.token()).toBe('new-access-token');
        expect(service.refreshToken()).toBe('new-refresh-token');
        expect(localStorage.getItem('token')).toBe('new-access-token');
        expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token');
    });

    it('should return false and keep previous tokens when refresh fails', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        localStorage.setItem('token', 'old-access-token');
        localStorage.setItem('refreshToken', 'old-refresh-token');
        const { service, httpTesting } = setup();

        let result: boolean | undefined;
        service.refreshAccessToken().subscribe((value) => {
            result = value;
        });

        const request = httpTesting.expectOne(`${environment.baseUrl}/auth/refresh-token`);
        request.flush(
            { message: 'failed' },
            { status: 500, statusText: 'Server Error' }
        );

        expect(result).toBe(false);
        expect(service.token()).toBe('old-access-token');
        expect(service.refreshToken()).toBe('old-refresh-token');
        expect(localStorage.getItem('token')).toBe('old-access-token');
        expect(localStorage.getItem('refreshToken')).toBe('old-refresh-token');
    });
});
