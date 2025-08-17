import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// match with your backend Role enum
export enum Role {
  Viewer = 'viewer',
  Creator = 'creator',
  Admin = 'admin',
}

export interface User {
  id: string;
  email: string;
  role: Role;
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly apiBaseUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getCurrentUserRole(): Role {
    return this.auth.userRole() as Role;
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiBaseUrl}/all-user`);
  }

  updateUserRole(userId: string, role: Role): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiBaseUrl}/${userId}/role`,
      { role }
    );
  }
}
