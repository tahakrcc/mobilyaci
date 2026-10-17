type EmailMessage = { to: string; subject: string; text: string };

async function sendEmail(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not-configured" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ORDER_FROM_EMAIL ?? "WoodenUniverse <onboarding@resend.dev>",
      to: [message.to],
      subject: message.subject,
      text: message.text,
    }),
  });
  return { sent: response.ok, reason: response.ok ? "sent" : `provider-${response.status}` };
}

function trackingUrl(orderNumber: string, trackingToken: string) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://woodenuniverse.vercel.app").replace(/\/$/, "");
  return `${base}/tr/track?order=${encodeURIComponent(orderNumber)}&token=${encodeURIComponent(trackingToken)}`;
}

export async function notifyNewOrder(order: { orderNumber: string; trackingToken: string; locale: "tr" | "en"; customerName: string; email: string; phone: string; summary: string }) {
  const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL;
  const admin = notificationEmail ? await sendEmail({
    to: notificationEmail,
    subject: `Yeni sipariş talebi: ${order.orderNumber}`,
    text: `${order.customerName}\n${order.email}\n${order.phone}\n\n${order.summary}\n\nTakip: ${trackingUrl(order.orderNumber, order.trackingToken)}`,
  }) : { sent: false, reason: "admin-not-configured" };
  const customer = await sendEmail({
    to: order.email,
    subject: order.locale === "tr" ? `Talebiniz alındı · ${order.orderNumber}` : `Your request was received · ${order.orderNumber}`,
    text: order.locale === "tr"
      ? `Merhaba ${order.customerName},\n\nWooden Universe tasarım talebinizi aldı. Bu işlem bir ödeme oluşturmaz. Ekibimiz fiyat ve üretim planı için sizinle iletişime geçecek.\n\nSipariş kodu: ${order.orderNumber}\n${order.summary}\n\nTakip: ${trackingUrl(order.orderNumber, order.trackingToken)}`
      : `Hello ${order.customerName},\n\nWooden Universe has received your design request. No payment has been taken. Our team will contact you with pricing and production details.\n\nRequest code: ${order.orderNumber}\n${order.summary}\n\nTrack: ${trackingUrl(order.orderNumber, order.trackingToken)}`,
  });
  return { sent: admin.sent && customer.sent, reason: `admin:${admin.reason};customer:${customer.reason}` };
}

export async function notifyOrderUpdate(order: { orderNumber: string; trackingToken: string; locale: string; customerName: string; email: string; statusLabel: string; publicNote: string; estimatedDelivery?: string | null }) {
  const tr = order.locale !== "en";
  return sendEmail({
    to: order.email,
    subject: tr ? `Sipariş güncellemesi · ${order.orderNumber}` : `Order update · ${order.orderNumber}`,
    text: tr
      ? `Merhaba ${order.customerName},\n\nSiparişinizin yeni durumu: ${order.statusLabel}.${order.publicNote ? `\n${order.publicNote}` : ""}${order.estimatedDelivery ? `\nTahmini teslim: ${order.estimatedDelivery}` : ""}\n\nTakip: ${trackingUrl(order.orderNumber, order.trackingToken)}`
      : `Hello ${order.customerName},\n\nYour request status is now: ${order.statusLabel}.${order.publicNote ? `\n${order.publicNote}` : ""}${order.estimatedDelivery ? `\nEstimated delivery: ${order.estimatedDelivery}` : ""}\n\nTrack: ${trackingUrl(order.orderNumber, order.trackingToken)}`,
  });
}
