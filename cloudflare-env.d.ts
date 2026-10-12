declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ADMIN_EMAILS?: string;
    RESEND_API_KEY?: string;
    ORDER_NOTIFICATION_EMAIL?: string;
    ORDER_FROM_EMAIL?: string;
  }
}
