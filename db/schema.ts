import { index, integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  trackingToken: text("tracking_token").notNull().unique(),
  locale: text("locale").notNull().default("tr"),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  productType: text("product_type").notNull(),
  woodType: text("wood_type").notNull(),
  epoxy: text("epoxy").notNull(),
  legStyle: text("leg_style").notNull(),
  dimensions: text("dimensions").notNull(),
  finish: text("finish").notNull(),
  notes: text("notes").notNull().default(""),
  referenceUrl: text("reference_url"),
  status: text("status").notNull().default("received"),
  estimatedDelivery: text("estimated_delivery"),
  quotedAmount: integer("quoted_amount"),
  currency: text("currency").notNull().default("TRY"),
  adminNotes: text("admin_notes").notNull().default(""),
  notificationStatus: text("notification_status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [index("orders_email_idx").on(table.email), index("orders_status_idx").on(table.status)]);

export const orderEvents = pgTable("order_events", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  status: text("status").notNull(),
  publicNote: text("public_note").notNull().default(""),
  internalNote: text("internal_note").notNull().default(""),
  mediaUrl: text("media_url"),
  createdAt: text("created_at").notNull(),
}, (table) => [index("order_events_order_id_idx").on(table.orderId)]);

export const siteContent = pgTable("site_content", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  locale: text("locale").notNull(),
  type: text("type").notNull().default("text"),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("site_content_key_locale_unique").on(table.key, table.locale)]);

export const media = pgTable("media", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  url: text("url").notNull(),
  altTr: text("alt_tr").notNull().default(""),
  altEn: text("alt_en").notNull().default(""),
  createdAt: text("created_at").notNull(),
});
