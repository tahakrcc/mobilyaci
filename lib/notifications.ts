export async function notifyNewOrder(order: { orderNumber: string; customerName: string; email: string; phone: string; summary: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL;
  if (!apiKey || !notificationEmail) return { sent: false, reason: "not-configured" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ORDER_FROM_EMAIL ?? "WoodenUniverse <onboarding@resend.dev>",
      to: [notificationEmail],
      subject: `Yeni sipariş talebi: ${order.orderNumber}`,
      text: `${order.customerName}\n${order.email}\n${order.phone}\n\n${order.summary}`,
    }),
  });
  return { sent: response.ok, reason: response.ok ? "sent" : `provider-${response.status}` };
}
