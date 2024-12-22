import User from "@/models/user.model";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { DecodedToken, Permission, Role } from "./type/user";

export async function checkPermission(
  request: NextRequest,
  requiredPermissions: string[]
) {
  try {
    const token = request.cookies.get("token")?.value ?? "";

    if (!token) {
      throw new Error("Authentication token missing");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedToken;

    const user = await User.findById(decodedToken.id).populate({
      path: "roles",
      populate: {
        path: "permissions",
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userPermissions: string[] = user.roles.flatMap((role: Role) =>
      role.permissions.map((permission: Permission) => permission.name)
    );

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      throw new Error("Insufficient permissions");
    }

    return true;
  } catch {
    return false;
  }
}
