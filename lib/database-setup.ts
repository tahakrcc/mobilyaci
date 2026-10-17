import { neon } from "@neondatabase/serverless";

const statements = [
  `CREATE TABLE IF NOT EXISTS orders (id text PRIMARY KEY, order_number text NOT NULL UNIQUE, tracking_token text NOT NULL UNIQUE, locale text NOT NULL DEFAULT 'tr', customer_name text NOT NULL, email text NOT NULL, phone text NOT NULL, city text NOT NULL, product_type text NOT NULL, wood_type text NOT NULL, epoxy text NOT NULL, leg_style text NOT NULL, dimensions text NOT NULL, finish text NOT NULL, notes text NOT NULL DEFAULT '', reference_url text, status text NOT NULL DEFAULT 'received', estimated_delivery text, quoted_amount integer, currency text NOT NULL DEFAULT 'TRY', admin_notes text NOT NULL DEFAULT '', notification_status text NOT NULL DEFAULT 'pending', created_at text NOT NULL, updated_at text NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS order_events (id text PRIMARY KEY, order_id text NOT NULL REFERENCES orders(id), status text NOT NULL, public_note text NOT NULL DEFAULT '', internal_note text NOT NULL DEFAULT '', media_url text, created_at text NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS site_content (id text PRIMARY KEY, key text NOT NULL, locale text NOT NULL, type text NOT NULL DEFAULT 'text', value text NOT NULL, updated_at text NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS media (id text PRIMARY KEY, key text NOT NULL UNIQUE, filename text NOT NULL, mime_type text NOT NULL, url text NOT NULL, alt_tr text NOT NULL DEFAULT '', alt_en text NOT NULL DEFAULT '', created_at text NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS orders_email_idx ON orders(email)`,
  `CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status)`,
  `CREATE INDEX IF NOT EXISTS order_events_order_id_idx ON order_events(order_id)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS site_content_key_locale_unique ON site_content(key, locale)`,
];

export async function ensureDatabaseSchema() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  const sql = neon(connectionString);
  for (const statement of statements) await sql.query(statement);
}
