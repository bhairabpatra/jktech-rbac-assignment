import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, RouterLink, RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}
  submit() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'All fields are required';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.loading = true;
    this.auth
      .register({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: (_) => this.router.navigate(['/login']),
        error: (err) => {
          this.error = err.error?.message || 'Registration failed';
          this.loading = false;
        },
      });
  }
}
