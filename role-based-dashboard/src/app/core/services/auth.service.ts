import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public login(data: { email: string; password: string;}): Observable<any> {
    return this.http.post<any>(`${this.API}/user/login-user`, data);
  }
  public register(data: { name: string; email: string; password: string;}): Observable<any> {
    return this.http.post(`${this.API}/user/add-user`, data);
  }

  public userRole(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }
}
