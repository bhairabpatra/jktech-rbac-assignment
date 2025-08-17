import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no pending requests
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login API with correct payload', () => {
    const dummyData = { email: 'test@test.com', password: '123456' };

    service.login(dummyData).subscribe((res) => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne('http://localhost:3000/user/login-user');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyData);

    req.flush({ success: true });
  });

  it('should call register API with correct payload', () => {
    const dummyData = { name: 'John', email: 'john@test.com', password: '123456' };

    service.register(dummyData).subscribe((res) => {
      expect(res).toEqual({ id: 1, ...dummyData });
    });

    const req = httpMock.expectOne('http://localhost:3000/user/add-user');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyData);

    req.flush({ id: 1, ...dummyData });
  });

  it('should return user role from token in localStorage', () => {
    const fakePayload = { role: 'admin' };
    const fakeToken =
      'header.' + btoa(JSON.stringify(fakePayload)) + '.signature';

    localStorage.setItem('token', fakeToken);

    const role = service.userRole();
    expect(role).toBe('admin');
  });

  it('should return empty string if no token in localStorage', () => {
    localStorage.removeItem('token');
    const role = service.userRole();
    expect(role).toBe('');
  });
});
