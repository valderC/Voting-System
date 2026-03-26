import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Flush the initial checkAuth() call from constructor
    httpMock.expectOne('/api/auth/me').flush({ username: null, role: null, authenticated: false });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and update current user', () => {
    const mockResponse = { username: 'admin', role: 'ROLE_ADMIN', authenticated: true };

    service.login({ username: 'admin', password: 'admin123' }).subscribe(user => {
      expect(user.authenticated).toBe(true);
      expect(user.username).toBe('admin');
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isAdmin()).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should logout and clear current user', () => {
    const mockResponse = { username: null, role: null, authenticated: false };

    service.logout().subscribe(user => {
      expect(user.authenticated).toBe(false);
    });

    const req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isAdmin()).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return false for isAdmin when not authenticated', () => {
    expect(service.isAdmin()).toBe(false);
  });
});
