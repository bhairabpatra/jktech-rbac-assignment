import { Injectable } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate() {
    return this.tokenService.payload$.pipe(
      map(payload => {
        const roles = payload ? this.tokenService.getRoles() : [];
        if (roles.includes('Admin')) {
          return true;
        }
        this.router.navigate(['/unauthorized']);
        return false;
      })
    );
  }
}
