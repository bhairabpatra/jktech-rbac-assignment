import { Component } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [    RouterLink,
    RouterLinkActive,
    NgIf,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

  isLoggedIn: boolean;

  constructor(private tokenService: TokenService) {
    this.isLoggedIn = this.tokenService.isLoggedIn();
  }
}
