import { cookies } from "next/headers";
import { getServiceClient } from "./client";
import type { AdminUser } from "./types";

const TOKEN_COOKIE = "tc_admin_token";
const USER_COOKIE = "tc_admin_user";

/** Set auth cookies after login — stores only ID and role (no PII) */
export async function setAuthCookies(token: string, user: AdminUser) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  cookieStore.set(USER_COOKIE, JSON.stringify({
    id: user.id,
    role: user.role,
  }), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
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

/** Get current authenticated admin user from cookies (server-side).
 *  Re-fetches full user from DB to ensure is_active and latest role. */
export async function getAuthUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_COOKIE);
  const tokenCookie = cookieStore.get(TOKEN_COOKIE);
  if (!userCookie?.value || !tokenCookie?.value) return null;

  try {
    const cookieData = JSON.parse(userCookie.value) as { id: string; role: string };

    // Verify token is still valid with Supabase
    const sb = getServiceClient();
    const { data } = await sb.auth.getUser(tokenCookie.value);
    if (!data?.user) return null;

    // Re-fetch full user from DB to check is_active and get latest data
    const { data: dbUser, error } = await sb
      .from("admin_users")
      .select("*")
      .eq("id", cookieData.id)
      .eq("is_active", true)
      .single();

    if (error || !dbUser) {
      // User deactivated or deleted — clear stale session
      await clearAuthCookies();
      return null;
    }

    return dbUser as AdminUser;
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
