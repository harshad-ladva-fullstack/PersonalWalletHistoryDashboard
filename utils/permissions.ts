export const PERMISSIONS = {
  // User Management
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_MANAGE: "user:manage",

  // Role Management
  ROLE_CREATE: "role:create",
  ROLE_READ: "role:read",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",
  ROLE_MANAGE: "role:manage",

  // Permission Management
  PERMISSION_READ: "permission:read",
  PERMISSION_MANAGE: "permission:manage",
};

export const DEFAULT_PERMISSIONS = [
  {
    name: PERMISSIONS.USER_CREATE,
    module: "user",
    action: "create",
    description: "Create users",
  },
  {
    name: PERMISSIONS.USER_READ,
    module: "user",
    action: "read",
    description: "Read users",
  },
  {
    name: PERMISSIONS.USER_UPDATE,
    module: "user",
    action: "update",
    description: "Update users",
  },
  {
    name: PERMISSIONS.USER_DELETE,
    module: "user",
    action: "delete",
    description: "Delete users",
  },
  {
    name: PERMISSIONS.USER_MANAGE,
    module: "user",
    action: "manage",
    description: "Manage users",
  },
];
