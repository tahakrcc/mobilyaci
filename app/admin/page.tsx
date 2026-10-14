import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { getAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return <AdminConsole userName={admin.displayName} />;
}
