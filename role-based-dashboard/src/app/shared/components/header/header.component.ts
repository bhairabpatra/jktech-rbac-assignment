import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgFor,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLoggedIn = false;
  username? = '';
  constructor(private auth: TokenService, private router: Router) {}
  ngOnInit() {
    this.auth.payload$.subscribe((stateValues) => {
      this.isLoggedIn = this.auth.isLoggedIn();
      this.username = stateValues?.name;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
