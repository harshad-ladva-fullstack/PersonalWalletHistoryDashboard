import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  permissions: string[];
}

export function usePermissions() {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserPermissions(decoded.permissions || []);
    }
  }, []);

  const hasPermission = (requiredPermissions: string[]) => {
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );
  };

  return { hasPermission, userPermissions };
}
