import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin-auth";
import { ensureDatabaseSchema } from "@/lib/database-setup";

export async function POST() {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    await ensureDatabaseSchema();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("database-setup", error);
    return NextResponse.json({ error: "database-setup-failed" }, { status: 500 });
  }
}
