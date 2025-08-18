import { Component } from '@angular/core';
import { PermissionService } from '../../core/services/permission.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiResponse, User } from '../../core/models/user.model';

  type UsersResponse = ApiResponse<User[]>;

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
})
export class ManageUsersComponent {
  users: any[] = [];
  public error: string = '';
  constructor(private permissionService: PermissionService) {}

  ngOnInit() {
    this.loadUsers();
  }

loadUsers() {
  this.permissionService.getUsers().subscribe({
    next: (res: UsersResponse) => {
      if (res.success) {
        this.users = res.data;
      }
    },
    error: (err) => {
      this.error = err.error?.message || 'Failed to load users';
    }
  });
}

  updateRole(user: any) {
    this.permissionService.updateUserRole(user.id, user.role).subscribe({
      next: () => {
        alert(`Role updated to ${user.role}`);
        this.loadUsers();
      },
      error: (err: any) => {
        console.error('Error updating role', err);
      },
    });
  }
}
