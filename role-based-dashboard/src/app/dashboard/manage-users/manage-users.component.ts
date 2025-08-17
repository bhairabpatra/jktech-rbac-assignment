import { Component } from '@angular/core';
import { PermissionService } from '../../core/services/permission.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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

  constructor(private permissionService: PermissionService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.permissionService.getUsers().subscribe((data) => (this.users = data));
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
