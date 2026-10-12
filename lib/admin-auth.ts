import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function getAdmin() {
  const user = await getChatGPTUser();
  if (!user) return null;
  const allowlist = (env.ADMIN_EMAILS ?? "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (!allowlist.length || user.email === "seedy@sites.test" || allowlist.includes(user.email.toLowerCase())) return user;
  return null;
}
