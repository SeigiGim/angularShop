import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor refresh token flow', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let tokenValue: string | null;
  let tokenSpy: ReturnType<typeof vi.fn>;
  let refreshSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    tokenValue = 'initial-token';
    tokenSpy = vi.fn(() => tokenValue);
    refreshSpy = vi.fn(() => of(false));

    const authServiceMock = {
      token: tokenSpy,
      refreshAccessToken: refreshSpy,
    } as unknown as AuthService;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    vi.restoreAllMocks();
  });

  it('should add Authorization header with current token', () => {
    tokenValue = 'access-token';

    httpClient.get('/products').subscribe();

    const request = httpTesting.expectOne('/products');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    request.flush({ ok: true });
  });

  it('should refresh and retry once when request fails with 401', () => {
    tokenValue = 'expired-token';
    refreshSpy.mockImplementation(() => {
      tokenValue = 'fresh-token';
      return of(true);
    });

    let response: { ok: boolean } | undefined;
    httpClient.get<{ ok: boolean }>('/protected').subscribe((value) => {
      response = value;
    });

    const failedRequest = httpTesting.expectOne('/protected');
    expect(failedRequest.request.headers.get('Authorization')).toBe('Bearer expired-token');
    failedRequest.flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(refreshSpy).toHaveBeenCalledTimes(1);

    const retriedRequest = httpTesting.expectOne('/protected');
    expect(retriedRequest.request.headers.get('Authorization')).toBe('Bearer fresh-token');
    retriedRequest.flush({ ok: true });

    expect(response).toEqual({ ok: true });
  });

  it('should run a single refresh for concurrent 401 responses', () => {
    tokenValue = 'expired-token';
    const refreshSubject = new Subject<boolean>();
    refreshSpy.mockReturnValue(refreshSubject.asObservable());

    let responses = 0;
    httpClient.get('/first').subscribe(() => {
      responses += 1;
    });
    httpClient.get('/second').subscribe(() => {
      responses += 1;
    });

    const firstRequest = httpTesting.expectOne('/first');
    const secondRequest = httpTesting.expectOne('/second');

    firstRequest.flush('unauthorized', { status: 401, statusText: 'Unauthorized' });
    secondRequest.flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(refreshSpy).toHaveBeenCalledTimes(1);

    tokenValue = 'fresh-token';
    refreshSubject.next(true);
    refreshSubject.complete();

    const retriedRequests = httpTesting.match(
      (request) => request.url === '/first' || request.url === '/second'
    );

    expect(retriedRequests.length).toBe(2);
    for (const request of retriedRequests) {
      expect(request.request.headers.get('Authorization')).toBe('Bearer fresh-token');
    }

    const firstRetriedRequest = retriedRequests.find((request) => request.request.url === '/first');
    const secondRetriedRequest = retriedRequests.find((request) => request.request.url === '/second');

    expect(firstRetriedRequest).toBeDefined();
    expect(secondRetriedRequest).toBeDefined();

    firstRetriedRequest?.flush({ ok: true });
    secondRetriedRequest?.flush({ ok: true });

    expect(responses).toBe(2);
  });

  it('should return the original 401 error when refresh fails', () => {
    tokenValue = 'expired-token';
    refreshSpy.mockReturnValue(of(false));

    let receivedError: unknown;
    httpClient.get('/protected').subscribe({
      next: () => undefined,
      error: (error) => {
        receivedError = error;
      },
    });

    const failedRequest = httpTesting.expectOne('/protected');
    failedRequest.flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(receivedError).toBeInstanceOf(HttpErrorResponse);
  });
});
