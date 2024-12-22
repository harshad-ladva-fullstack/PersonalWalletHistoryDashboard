export interface Permission {
  name: string;
}

export interface Role {
  permissions: Permission[];
}

export interface User {
  roles: Role[];
}

export interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}
