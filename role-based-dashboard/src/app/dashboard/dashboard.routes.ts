import { Routes } from '@angular/router';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CreateContentComponent } from './create-content/create-content.component';
import { ViewContentComponent } from './view-content/view-content.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { CreatorGuard } from '../core/guards/creator.guard';
import { IngestionManagementComponent } from './ingestion-management/ingestion-management.component';


export const adminRoutes: Routes = [
  { path: 'manage-users', component: ManageUsersComponent, canActivate: [AdminGuard] },
  { path: 'upload-documents', component: CreateContentComponent}, //Editor
  { path: 'view-content', component: ViewContentComponent },
  { path: 'ingestion-management', component: IngestionManagementComponent,canActivate: [AdminGuard] }
];

export const creatorRoutes: Routes = [
  { path: 'upload-documents', component: CreateContentComponent, canActivate: [CreatorGuard] }, //Editor
  { path: 'view-content', component: ViewContentComponent }
];

export const viewerRoutes: Routes = [
  { path: 'view-content', component: ViewContentComponent }
];
