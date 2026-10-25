type EmailMessage = { to: string; subject: string; text: string; html: string };

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailLayout({ eyebrow, title, intro, orderNumber, details, actionLabel, actionUrl, footerNote }: {
  eyebrow: string;
  title: string;
  intro: string;
  orderNumber: string;
  details: Array<{ label: string; value: string }>;
  actionLabel: string;
  actionUrl: string;
  footerNote: string;
}) {
  const detailRows = details.map(({ label, value }) => `
    <tr>
      <td style="padding:10px 0;color:#8f8879;font-size:12px;line-height:18px;text-transform:uppercase;letter-spacing:1.2px;border-bottom:1px solid #2a261d;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#f3ead9;font-size:14px;line-height:20px;text-align:right;border-bottom:1px solid #2a261d;">${escapeHtml(value)}</td>
    </tr>`).join("");

  return `<!doctype html>
  <html lang="tr">
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#090a08;color:#f3ead9;font-family:Arial,Helvetica,sans-serif;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(intro)}</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090a08;">
        <tr><td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#11120f;border:1px solid #3b321c;border-radius:18px;overflow:hidden;">
            <tr><td style="height:5px;background:#c99a35;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr><td style="padding:32px 36px 18px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
                <td style="vertical-align:middle;"><span style="display:inline-block;width:42px;height:42px;line-height:42px;text-align:center;border:1px solid #c99a35;border-radius:50%;color:#d9ad4e;font-family:Georgia,serif;font-size:17px;">WU</span></td>
                <td style="vertical-align:middle;padding-left:13px;color:#f5ead4;font-size:13px;line-height:18px;font-weight:700;letter-spacing:2.6px;">WOODEN<br><span style="color:#c99a35;font-size:9px;letter-spacing:3.3px;">UNIVERSE</span></td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:12px 36px 0;color:#c99a35;font-size:11px;line-height:18px;font-weight:700;letter-spacing:2px;">${escapeHtml(eyebrow)}</td></tr>
            <tr><td style="padding:10px 36px 0;color:#fff8ea;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:41px;">${escapeHtml(title)}</td></tr>
            <tr><td style="padding:18px 36px 0;color:#bcb3a3;font-size:15px;line-height:24px;">${escapeHtml(intro)}</td></tr>
            <tr><td style="padding:28px 36px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0c0a;border:1px solid #2e291e;border-radius:12px;">
                <tr><td style="padding:22px 24px 8px;color:#8f8879;font-size:10px;line-height:16px;letter-spacing:1.8px;text-transform:uppercase;">Sipariş kodu</td></tr>
                <tr><td style="padding:0 24px 18px;color:#d9ad4e;font-family:Georgia,'Times New Roman',serif;font-size:25px;line-height:32px;letter-spacing:1px;">${escapeHtml(orderNumber)}</td></tr>
                <tr><td style="padding:0 24px 18px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${detailRows}</table></td></tr>
              </table>
            </td></tr>
            <tr><td align="center" style="padding:28px 36px 10px;">
              <a href="${escapeHtml(actionUrl)}" style="display:inline-block;background:#d2a443;color:#11120f;text-decoration:none;font-size:13px;line-height:18px;font-weight:700;letter-spacing:1px;padding:15px 24px;border-radius:8px;">${escapeHtml(actionLabel)}</a>
            </td></tr>
            <tr><td style="padding:12px 36px 34px;color:#777165;font-size:12px;line-height:19px;text-align:center;">${escapeHtml(footerNote)}</td></tr>
            <tr><td style="padding:20px 36px;background:#0b0c0a;border-top:1px solid #262219;color:#686258;font-size:11px;line-height:18px;text-align:center;">El işçiliğiyle üretilen, kendine özgü mobilyalar · Wooden Universe</td></tr>
          </table>
        </td></tr>
      </table>
    </body>
  </html>`;
}

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
      html: message.html,
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
  const url = trackingUrl(order.orderNumber, order.trackingToken);
  const admin = notificationEmail ? await sendEmail({
    to: notificationEmail,
    subject: `Yeni sipariş talebi: ${order.orderNumber}`,
    text: `${order.customerName}\n${order.email}\n${order.phone}\n\n${order.summary}\n\nTakip: ${url}`,
    html: emailLayout({
      eyebrow: "YENİ TASARIM TALEBİ",
      title: "Atölyeye yeni bir talep ulaştı.",
      intro: `${order.customerName} özel üretim için iletişim bilgilerini bıraktı.`,
      orderNumber: order.orderNumber,
      details: [
        { label: "Müşteri", value: order.customerName },
        { label: "E-posta", value: order.email },
        { label: "Telefon", value: order.phone },
        { label: "Talep", value: order.summary },
      ],
      actionLabel: "SİPARİŞİ GÖRÜNTÜLE",
      actionUrl: url,
      footerNote: "Müşteriyle fiyat ve üretim planı için iletişime geçin.",
    }),
  }) : { sent: false, reason: "admin-not-configured" };
  const tr = order.locale === "tr";
  const customer = await sendEmail({
    to: order.email,
    subject: tr ? `Talebiniz alındı · ${order.orderNumber}` : `Your request was received · ${order.orderNumber}`,
    text: tr
      ? `Merhaba ${order.customerName},\n\nWooden Universe tasarım talebinizi aldı. Bu işlem bir ödeme oluşturmaz. Ekibimiz fiyat ve üretim planı için sizinle iletişime geçecek.\n\nSipariş kodu: ${order.orderNumber}\n${order.summary}\n\nTakip: ${url}`
      : `Hello ${order.customerName},\n\nWooden Universe has received your design request. No payment has been taken. Our team will contact you with pricing and production details.\n\nRequest code: ${order.orderNumber}\n${order.summary}\n\nTrack: ${url}`,
    html: emailLayout({
      eyebrow: tr ? "TASARIM TALEBİNİZ ALINDI" : "YOUR DESIGN REQUEST IS IN",
      title: tr ? "Parçanızın yolculuğu başladı." : "Your piece's journey has begun.",
      intro: tr
        ? `Merhaba ${order.customerName}, talebiniz ekibimize ulaştı. Fiyat ve üretim planı için sizinle iletişime geçeceğiz.`
        : `Hello ${order.customerName}, your request has reached our team. We will contact you with pricing and production details.`,
      orderNumber: order.orderNumber,
      details: [{ label: tr ? "Tasarım özeti" : "Design summary", value: order.summary }],
      actionLabel: tr ? "SİPARİŞİ TAKİP ET" : "TRACK YOUR REQUEST",
      actionUrl: url,
      footerNote: tr ? "Bu talep bir ödeme oluşturmaz." : "This request does not create a payment.",
    }),
  });
  return { sent: admin.sent && customer.sent, reason: `admin:${admin.reason};customer:${customer.reason}` };
}

export async function notifyOrderUpdate(order: { orderNumber: string; trackingToken: string; locale: string; customerName: string; email: string; statusLabel: string; publicNote: string; estimatedDelivery?: string | null }) {
  const tr = order.locale !== "en";
  const url = trackingUrl(order.orderNumber, order.trackingToken);
  return sendEmail({
    to: order.email,
    subject: tr ? `Sipariş güncellemesi · ${order.orderNumber}` : `Order update · ${order.orderNumber}`,
    text: tr
      ? `Merhaba ${order.customerName},\n\nSiparişinizin yeni durumu: ${order.statusLabel}.${order.publicNote ? `\n${order.publicNote}` : ""}${order.estimatedDelivery ? `\nTahmini teslim: ${order.estimatedDelivery}` : ""}\n\nTakip: ${url}`
      : `Hello ${order.customerName},\n\nYour request status is now: ${order.statusLabel}.${order.publicNote ? `\n${order.publicNote}` : ""}${order.estimatedDelivery ? `\nEstimated delivery: ${order.estimatedDelivery}` : ""}\n\nTrack: ${url}`,
    html: emailLayout({
      eyebrow: tr ? "ATÖLYEDEN GÜNCELLEME" : "WORKSHOP UPDATE",
      title: order.statusLabel,
      intro: order.publicNote || (tr ? `Merhaba ${order.customerName}, siparişinizin durumu güncellendi.` : `Hello ${order.customerName}, your request status has been updated.`),
      orderNumber: order.orderNumber,
      details: order.estimatedDelivery ? [{ label: tr ? "Tahmini teslim" : "Estimated delivery", value: order.estimatedDelivery }] : [],
      actionLabel: tr ? "SİPARİŞİ TAKİP ET" : "TRACK YOUR REQUEST",
      actionUrl: url,
      footerNote: tr ? "En güncel üretim aşamalarını takip sayfasından görebilirsiniz." : "See the latest production milestones on the tracking page.",
    }),
  });
}
