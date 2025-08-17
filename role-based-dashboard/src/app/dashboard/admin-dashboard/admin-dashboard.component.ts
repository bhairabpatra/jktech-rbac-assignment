import { Component } from '@angular/core';
import { PermissionService } from '../../core/services/permission.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from '../../core/services/token.service';
import { adminRoutes, creatorRoutes, viewerRoutes } from '../dashboard.routes';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    HttpClientModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  menuLinks: { label: string; path: string }[] = [];
  role: string | null = null;
  roles: string[] = [];
  username: string | undefined;

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit() {
    const role = this.tokenService.getRoles()[0]?.toLowerCase();
    let selectedRoutes;
    if (role === 'admin') {
      selectedRoutes = adminRoutes;
      this.menuLinks = [
        { label: 'Manage Users', path: 'manage-users' },
        { label: 'Upload documents', path: 'upload-documents' },
        { label: 'View Content', path: 'view-content' },
        { label: 'Ingestion Management', path: 'ingestion-management' },
      ];
    } else if (role === 'editor') {
      selectedRoutes = creatorRoutes;
      this.menuLinks = [
        { label: 'Upload documents', path: 'upload-documents' },
        { label: 'View Content', path: 'view-content' },
      ];
    } else {
      selectedRoutes = viewerRoutes;
      this.menuLinks = [{ label: 'View Content', path: 'view-content' }];
    }

    const newConfig = this.router.config.map((route) => {
      if (route.path === 'dashboard') {
        return {
          ...route,
          children: selectedRoutes,
        };
      }
      return route;
    });

    this.router.resetConfig(newConfig);

    this.tokenService.payload$.subscribe((stateValues) => {
      this.role = stateValues?.['role'];
      this.username = stateValues?.name;
    });
  }
}
