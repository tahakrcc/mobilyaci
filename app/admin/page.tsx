import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { chatGPTSignInPath } from "@/app/chatgpt-auth";
import { getAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getAdmin();
  if (!admin) redirect(chatGPTSignInPath("/admin"));
  return <AdminConsole userName={admin.displayName} />;
}
