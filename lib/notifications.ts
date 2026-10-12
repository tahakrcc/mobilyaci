import { env } from "cloudflare:workers";

export async function notifyNewOrder(order: { orderNumber: string; customerName: string; email: string; phone: string; summary: string }) {
  if (!env.RESEND_API_KEY || !env.ORDER_NOTIFICATION_EMAIL) return { sent: false, reason: "not-configured" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.ORDER_FROM_EMAIL ?? "WoodenUniverse <orders@updates.example>",
      to: [env.ORDER_NOTIFICATION_EMAIL],
      subject: `Yeni sipariş talebi: ${order.orderNumber}`,
      text: `${order.customerName}\n${order.email}\n${order.phone}\n\n${order.summary}`,
    }),
  });
  return { sent: response.ok, reason: response.ok ? "sent" : `provider-${response.status}` };
}
