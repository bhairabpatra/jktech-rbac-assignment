// roles.enum.ts
export enum Role {
    Viewer = 'viewer',
    Creator = 'creator',
    Admin = 'admin',
  }
  
  export const RolePermissions = {
    [Role.Viewer]: ['view'],
    [Role.Creator]: ['view', 'create', 'download'],
    [Role.Admin]: ['view', 'create', 'edit', 'delete', 'download'],
  };
  