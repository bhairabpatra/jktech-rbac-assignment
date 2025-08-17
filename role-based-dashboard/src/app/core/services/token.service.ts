import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  roles?: string[] | string;
  email?: string;
  name?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token'; // optional
  private _payload$ = new BehaviorSubject<JwtPayload | null>(
    this.getDecodedPayload()
  );
  public payload$: Observable<JwtPayload | null> =
    this._payload$.asObservable();

  setToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._payload$.next(this.decodeToken(token));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._payload$.next(null);
  }

  // Check login presence (token exists and not expired)
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return true;
  }

  getDecodedPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  getRoles(): string[] {
    const payload = this.getDecodedPayload();
    if (!payload) return [];
    const roles = payload.roles ?? payload['role'] ?? payload['scope'];
    if (!roles) return [];
    return Array.isArray(roles)
      ? roles
      : String(roles)
          .split(',')
          .map((r) => r.trim());
  }

  getUserId(): string | undefined {
    const payload = this.getDecodedPayload();
    return payload?.sub;
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      return JSON.parse(
        atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      ) as JwtPayload;
    } catch {
      return null;
    }
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }
}
