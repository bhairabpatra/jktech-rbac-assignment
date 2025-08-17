import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CreatorGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate() {
    return this.tokenService.payload$.pipe(
      map(payload => {
        const roles = payload ? this.tokenService.getRoles() : [];
        if (roles.includes('Editor')) {
          return true;
        }
        this.router.navigate(['/unauthorized']);
        return false;
      })
    );
  }
}
