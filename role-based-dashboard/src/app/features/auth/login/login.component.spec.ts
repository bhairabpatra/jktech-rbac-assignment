// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
// import { AuthService } from '../../../core/services/auth.service';
// import { LoginComponent } from './login.component';

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//         FormsModule,
//         ReactiveFormsModule,
//         LoginComponent
//       ],
//       providers: [
//         AuthService,
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             params: of({}),
//             queryParams: of({}),
//             snapshot: { params: {}, queryParams: {} },
//             url: of([]),
//             fragment: of(null),
//             data: of({})
//           }
//         }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockTokenService: jasmine.SpyObj<TokenService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spy objects for the services
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockTokenService = jasmine.createSpyObj('TokenService', ['setToken']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    // Create component instance manually
    component = new LoginComponent(
      mockAuthService,
      mockTokenService,
      mockRouter
    );
  });

  // Test 1: Component Creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Form Validation - Empty Fields
  it('should show error when email or password is empty', () => {
    component.email = '';
    component.password = '';
    
    component.submit();
    
    expect(component.error).toBe('All fields are required');
    expect(component.loading).toBeFalse();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  // Test 3: Successful Login
  it('should handle successful login', () => {
    const mockResponse = { accessToken: 'fake-token-123' };
    mockAuthService.login.and.returnValue(of(mockResponse));
    
    component.email = 'test@example.com';
    component.password = 'password123';
    
    component.submit();
    
    expect(component.loading).toBeTrue();
    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(mockTokenService.setToken).toHaveBeenCalledWith('fake-token-123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

 

  // Test 5: Login Error Without Message
  it('should handle login error without message', () => {
    const errorResponse = { error: {} };
    mockAuthService.login.and.returnValue(throwError(() => errorResponse));
    
    component.email = 'test@example.com';
    component.password = 'password123';
    
    component.submit();
    
    expect(component.error).toBe('Login failed');
    expect(component.loading).toBeFalse();
  });

  // Test 6: Initial State
  it('should initialize with empty values', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.error).toBe('');
    expect(component.loading).toBeFalse();
  });

  // Test 7: Partial Validation - Only Email
  it('should show error when only email is provided', () => {
    component.email = 'test@example.com';
    component.password = '';
    
    component.submit();
    
    expect(component.error).toBe('All fields are required');
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  // Test 8: Partial Validation - Only Password
  it('should show error when only password is provided', () => {
    component.email = '';
    component.password = 'password123';
    
    component.submit();
    
    expect(component.error).toBe('All fields are required');
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  // Test 9: Loading State
  it('should set loading to true when submitting valid form', () => {
    const mockResponse = { accessToken: 'fake-token' };
    mockAuthService.login.and.returnValue(of(mockResponse));
    
    component.email = 'test@example.com';
    component.password = 'password123';
    
    expect(component.loading).toBeFalse();
    
    component.submit();
    
    expect(component.loading).toBeTrue();
  });

  // Test 10: Error Handling with Network Error
  it('should handle network error gracefully', () => {
    const networkError = new Error('Network error');
    mockAuthService.login.and.returnValue(throwError(() => networkError));
    
    component.email = 'test@example.com';
    component.password = 'password123';
    
    component.submit();
    
    expect(component.error).toBe('Login failed');
    expect(component.loading).toBeFalse();
  });
});