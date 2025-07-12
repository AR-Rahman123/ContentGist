import { users, posts, plans, payments, type User, type InsertUser, type Post, type InsertPost, type Plan, type InsertPlan, type Payment } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private plans: Map<number, Plan>;
  private payments: Map<number, Payment>;
  private currentUserId: number;
  private currentPostId: number;
  private currentPlanId: number;
  private currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.plans = new Map();
    this.payments = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentPlanId = 1;
    this.currentPaymentId = 1;
    
    // Initialize default plans
    this.initializePlans();
    this.createAdminUser();
  }

  private async initializePlans() {
    const defaultPlans = [
      { name: "Basic", description: "Perfect for getting started", price: "9.99", postsLimit: 10, stripePriceId: "price_basic" },
      { name: "Pro", description: "Great for growing businesses", price: "29.99", postsLimit: 50, stripePriceId: "price_pro" },
      { name: "Premium", description: "For enterprise needs", price: "99.99", postsLimit: 200, stripePriceId: "price_premium" }
    ];

    for (const plan of defaultPlans) {
      await this.createPlan(plan);
    }
  }

  private async createAdminUser() {
    const admin: InsertUser = {
      email: "admin@contentgist.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
      name: "Admin User"
    };
    
    const adminUser = await this.createUser(admin);
    await this.updateUser(adminUser.id, { role: "admin" });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      role: "user",
      planId: null,
      stripeCustomerId: null,
      subscriptionStatus: "inactive",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Post methods
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostsByUser(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => post.userId === userId);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = {
      ...insertPost,
      id,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updates, updatedAt: new Date() };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async getScheduledPosts(): Promise<Post[]> {
    const now = new Date();
    return Array.from(this.posts.values()).filter(
      post => post.status === "scheduled" && post.scheduledAt && post.scheduledAt <= now
    );
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  // Plan methods
  async getPlan(id: number): Promise<Plan | undefined> {
    return this.plans.get(id);
  }

  async getAllPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values());
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const id = this.currentPlanId++;
    const plan: Plan = {
      ...insertPlan,
      id,
      createdAt: new Date()
    };
    this.plans.set(id, plan);
    return plan;
  }

  // Payment methods
  async createPayment(payment: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> {
    const id = this.currentPaymentId++;
    const newPayment: Payment = {
      ...payment,
      id,
      createdAt: new Date()
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.userId === userId);
  }
}

export const storage = new MemStorage();
