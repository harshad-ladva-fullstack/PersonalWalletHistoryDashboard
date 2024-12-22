import connectDB from "@/lib/db";
import Permission from "@/models/permission.model";
import Role from "@/models/role.model";
import User from "@/models/user.model";
import { DEFAULT_PERMISSIONS } from "@/utils/permissions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface TokenData {
  id: string;
  email: string;
  username: string;
  name: string;
  roles: string[];
}

async function setupInitialPermissionsAndRoles() {
  // Create default permissions
  const createdPermissions = await Promise.all(
    DEFAULT_PERMISSIONS.map(async (permission) => {
      return await Permission.findOneAndUpdate(
        { name: permission.name },
        permission,
        { upsert: true, new: true }
      );
    })
  );

  // Create super admin role with all permissions
  const superAdminRole = await Role.findOneAndUpdate(
    { name: "superadmin" },
    {
      name: "superadmin",
      description: "Super Administrator with all permissions",
      permissions: createdPermissions.map((p) => p._id),
      isSystem: true,
    },
    { upsert: true, new: true }
  );

  return superAdminRole;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    // Check if any user exists
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      // First-time setup
      if (
        email === process.env.SUPER_USER_EMAIL &&
        password === process.env.SUPER_USER_PASSWORD
      ) {
        // Setup permissions and roles
        const superAdminRole = await setupInitialPermissionsAndRoles();

        // Create super admin user
        const hashedPassword = await bcrypt.hash(password, 10);
        const superUser = await User.create({
          email: process.env.SUPER_USER_EMAIL,
          password: hashedPassword,
          username: "superadmin",
          name: "Super Admin",
          roles: [superAdminRole._id],
          isVerified: true,
        });

        // Generate token
        const tokenData = {
          id: superUser._id,
          email: superUser.email,
          username: superUser.username,
          name: superUser.name,
          roles: [superAdminRole.name],
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
          expiresIn: "1d",
        });

        const response = NextResponse.json({
          message: "Super admin created and logged in successfully",
          success: true,
        });

        response.cookies.set("token", token, {
          httpOnly: true,
        });

        return response;
      }
    }

    // Normal login flow
    const user = await User.findOne({ email }).populate("roles");

    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const tokenData: TokenData = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      roles: user.roles.map((role: { name: string }) => role.name),
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        message: "Login failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
