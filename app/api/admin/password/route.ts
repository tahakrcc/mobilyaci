import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_SESSION_COOKIE, changeAdminPassword, getAdmin } from "@/lib/admin-auth";

const passwordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(12).max(128),
  confirmation: z.string(),
});

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = passwordSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid-password" }, { status: 400 });
  const { currentPassword, newPassword, confirmation } = parsed.data;
  if (newPassword !== confirmation) return NextResponse.json({ error: "confirmation-mismatch" }, { status: 400 });
  if (newPassword === currentPassword) return NextResponse.json({ error: "same-password" }, { status: 400 });

  try {
    const session = await changeAdminPassword(admin.email, currentPassword, newPassword);
    if (!session) return NextResponse.json({ error: "invalid-current-password" }, { status: 400 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(session.expiresAt * 1000),
    });
    return response;
  } catch (error) {
    console.error("admin-password-change", error);
    return NextResponse.json({ error: "password-change-failed" }, { status: 503 });
  }
}
