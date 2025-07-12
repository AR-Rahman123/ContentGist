import { users, posts, plans, payments, type User, type InsertUser, type Post, type InsertPost, type Plan, type InsertPlan, type Payment } from "@shared/schema";
import { db } from "./db";
import { eq, and, lte } from "drizzle-orm";
import { hashPassword } from "./auth";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Post methods
  getPost(id: number): Promise<Post | undefined>;
  getPostsByUser(userId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined>;
  getScheduledPosts(): Promise<Post[]>;
  getAllPosts(): Promise<Post[]>;

  // Plan methods
  getPlan(id: number): Promise<Plan | undefined>;
  getAllPlans(): Promise<Plan[]>;
  createPlan(plan: InsertPlan): Promise<Plan>;

  // Payment methods
  createPayment(payment: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize default data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    try {
      // Check if plans exist
      const existingPlans = await db.select().from(plans);
      if (existingPlans.length === 0) {
        await this.initializePlans();
      }

      // Check if admin user exists
      const adminUser = await db.select().from(users).where(eq(users.email, "admin@contentgist.com"));
      if (adminUser.length === 0) {
        await this.createAdminUser();
      }
    } catch (error) {
      console.log('Database initialization will be handled on first request');
    }
  }

  private async initializePlans() {
    const defaultPlans = [
      { name: "Basic", description: "Perfect for getting started", price: "9.99", postsLimit: 10, stripePriceId: "price_basic" },
      { name: "Pro", description: "Great for growing businesses", price: "29.99", postsLimit: 50, stripePriceId: "price_pro" },
      { name: "Premium", description: "For enterprise needs", price: "99.99", postsLimit: 200, stripePriceId: "price_premium" }
    ];

    for (const plan of defaultPlans) {
      await db.insert(plans).values(plan);
    }
  }

  private async createAdminUser() {
    const hashedPassword = await hashPassword("password");
    const admin: InsertUser = {
      email: "admin@contentgist.com",
      password: hashedPassword,
      name: "Admin User"
    };
    
    const [adminUser] = await db.insert(users).values(admin).returning();
    await db.update(users).set({ role: "admin" }).where(eq(users.id, adminUser.id));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Post methods
  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async getPostsByUser(userId: number): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.userId, userId));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(insertPost).returning();
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const [post] = await db.update(posts).set({ ...updates, updatedAt: new Date() }).where(eq(posts.id, id)).returning();
    return post || undefined;
  }

  async getScheduledPosts(): Promise<Post[]> {
    const now = new Date();
    return await db.select().from(posts).where(
      and(
        eq(posts.status, "scheduled"),
        lte(posts.scheduledAt, now)
      )
    );
  }

  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(posts);
  }

  // Plan methods
  async getPlan(id: number): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.id, id));
    return plan || undefined;
  }

  async getAllPlans(): Promise<Plan[]> {
    return await db.select().from(plans);
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const [plan] = await db.insert(plans).values(insertPlan).returning();
    return plan;
  }

  // Payment methods
  async createPayment(payment: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId));
  }
}

export const storage = new DatabaseStorage();
