import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PermissionService, Role, User } from './permission.service';
import { AuthService } from './auth.service';

describe('PermissionService', () => {
  let service: PermissionService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUsers: User[] = [
    { id: '1', email: 'user1@example.com', role: Role.Viewer },
    { id: '2', email: 'user2@example.com', role: Role.Creator },
    { id: '3', email: 'admin@example.com', role: Role.Admin }
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['userRole']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PermissionService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(PermissionService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCurrentUserRole', () => {
    it('should return the current user role from AuthService', () => {
      const expectedRole = Role.Admin;
      authServiceSpy.userRole.and.returnValue(expectedRole);
      const result = service.getCurrentUserRole();
      expect(result).toBe(expectedRole);
      expect(authServiceSpy.userRole).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUsers', () => {
    it('should fetch all users from the API', () => {
      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(3);
        expect(users[0].email).toBe('user1@example.com');
        expect(users[2].role).toBe(Role.Admin);
      });
      const req = httpMock.expectOne('http://localhost:3000/user/all-user');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role and return success message', () => {
      const userId = '123';
      const newRole = Role.Creator;
      const expectedResponse = { message: 'User role updated successfully' };
      service.updateUserRole(userId, newRole).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        expect(response.message).toBe('User role updated successfully');
      });
      const req = httpMock.expectOne(`http://localhost:3000/user/${userId}/role`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ role: newRole });
      req.flush(expectedResponse);
    });
  });
});