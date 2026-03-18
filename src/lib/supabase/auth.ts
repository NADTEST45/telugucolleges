import { cookies } from "next/headers";
import { getServiceClient } from "./client";
import type { AdminUser } from "./types";

const TOKEN_COOKIE = "tc_admin_token";
const USER_COOKIE = "tc_admin_user";

/** Set auth cookies after login */
export async function setAuthCookies(token: string, user: AdminUser) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  cookieStore.set(USER_COOKIE, JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    college_code: user.college_code,
    college_name: user.college_name,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** Clear auth cookies on logout */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(USER_COOKIE);
}

/** Get current authenticated admin user from cookies (server-side) */
export async function getAuthUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_COOKIE);
  const tokenCookie = cookieStore.get(TOKEN_COOKIE);
  if (!userCookie?.value || !tokenCookie?.value) return null;

  try {
    const user = JSON.parse(userCookie.value) as AdminUser;

    // Verify token is still valid with Supabase
    const sb = getServiceClient();
    const { data } = await sb.auth.getUser(tokenCookie.value);
    if (!data?.user) return null;

    return user;
  } catch {
    return null;
  }
}

/** Require authentication — returns user or throws */
export async function requireAuth(): Promise<AdminUser> {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

/** Require super admin role */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const user = await requireAuth();
  if (user.role !== "super_admin") throw new Error("Forbidden");
  return user;
}

/** Require college admin for a specific college */
export async function requireCollegeAdmin(collegeCode?: string): Promise<AdminUser> {
  const user = await requireAuth();
  if (user.role === "super_admin") return user;
  if (user.role !== "college_admin") throw new Error("Forbidden");
  if (collegeCode && user.college_code !== collegeCode) throw new Error("Forbidden");
  return user;
}

/** Require marketing role */
export async function requireMarketing(): Promise<AdminUser> {
  const user = await requireAuth();
  if (user.role === "super_admin") return user;
  if (user.role !== "marketing") throw new Error("Forbidden");
  return user;
}
