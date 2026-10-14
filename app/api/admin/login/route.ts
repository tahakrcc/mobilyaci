import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const session = createAdminSession(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
  if (!session) return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(ADMIN_SESSION_COOKIE, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(session.expiresAt * 1000),
  });
  return response;
}
