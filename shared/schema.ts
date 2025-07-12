import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"), // "user" or "admin"
  planId: integer("plan_id").references(() => plans.id),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionStatus: text("subscription_status").default("inactive"), // "active", "inactive", "canceled"
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(), // "facebook", "instagram", "twitter", "linkedin", "youtube"
  accountId: text("account_id").notNull(), // Social media account ID
  accountName: text("account_name").notNull(), // Display name/username
  accessToken: text("access_token").notNull(), // Encrypted access token
  refreshToken: text("refresh_token"), // For platforms that support refresh tokens
  expiresAt: timestamp("expires_at"), // Token expiration
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(),
  followers: integer("followers").default(0),
  engagement: decimal("engagement", { precision: 5, scale: 2 }).default("0"), // percentage
  reach: integer("reach").default(0),
  impressions: integer("impressions").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  clicks: integer("clicks").default(0),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  postsLimit: integer("posts_limit").notNull(),
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrls: text("media_urls").array(), // Array of image/video URLs
  platforms: text("platforms").array().notNull(), // Array of platforms to post to
  hashtags: text("hashtags").array(), // Array of hashtags
  scheduledAt: timestamp("scheduled_at"),
  status: text("status").notNull().default("draft"), // "draft", "scheduled", "posted", "pending_approval", "approved", "rejected"
  createdBy: integer("created_by").notNull().references(() => users.id), // Admin who created the post
  approvedBy: integer("approved_by").references(() => users.id), // Client who approved
  rejectionReason: text("rejection_reason"), // If rejected
  publishedAt: timestamp("published_at"), // When actually posted to social media
  publishResults: text("publish_results"), // JSON string of publish results per platform
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  planId: integer("plan_id").notNull().references(() => plans.id),
  stripePaymentId: text("stripe_payment_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // "succeeded", "failed", "pending"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  title: true,
  content: true,
  mediaUrls: true,
  platforms: true,
  hashtags: true,
  scheduledAt: true,
  createdBy: true,
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).pick({
  userId: true,
  platform: true,
  accountId: true,
  accountName: true,
  accessToken: true,
  refreshToken: true,
  expiresAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  userId: true,
  platform: true,
  followers: true,
  engagement: true,
  reach: true,
  impressions: true,
  likes: true,
  comments: true,
  shares: true,
  clicks: true,
  date: true,
});

export const insertPlanSchema = createInsertSchema(plans).pick({
  name: true,
  description: true,
  price: true,
  postsLimit: true,
  stripePriceId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
