import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateToken, requireAdmin, hashPassword, comparePassword, generateToken, type AuthRequest } from "./auth";
import { insertUserSchema, insertPostSchema } from "@shared/schema";
import { startScheduler } from "./scheduler";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2023-10-16',
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the post scheduler
  startScheduler();

  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({ email, password: hashedPassword, name });
      
      // Generate token
      const token = generateToken(user.id, user.email, user.role);
      
      res.json({ 
        token, 
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
      });
    } catch (error) {
      res.status(400).json({ message: 'Invalid registration data' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user.id, user.email, user.role);
      
      res.json({ 
        token, 
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
      });
    } catch (error) {
      res.status(400).json({ message: 'Login failed' });
    }
  });

  // Protected routes
  app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res) => {
    const user = await storage.getUser(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role,
      planId: user.planId,
      subscriptionStatus: user.subscriptionStatus
    });
  });

  // Plans routes
  app.get('/api/plans', async (req, res) => {
    const plans = await storage.getAllPlans();
    res.json(plans);
  });

  // Stripe payment routes
  app.post('/api/payments/create-checkout-session', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { planId } = req.body;
      const plan = await storage.getPlan(planId);
      
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: plan.name,
                description: plan.description || '',
              },
              unit_amount: Math.round(parseFloat(plan.price) * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/dashboard?success=true`,
        cancel_url: `${req.headers.origin}/pricing?canceled=true`,
        metadata: {
          userId: req.user!.id.toString(),
          planId: planId.toString(),
        },
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create checkout session' });
    }
  });

  // Posts routes
  app.get('/api/posts', authenticateToken, async (req: AuthRequest, res) => {
    if (req.user!.role === 'admin') {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } else {
      const posts = await storage.getPostsByUser(req.user!.id);
      res.json(posts);
    }
  });

  app.post('/api/posts', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      
      // If scheduled time is provided, set status to scheduled
      if (postData.scheduledAt) {
        await storage.updatePost(post.id, { status: 'scheduled' });
      }
      
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: 'Invalid post data' });
    }
  });

  app.put('/api/posts/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.id);
      const updates = req.body;
      
      const post = await storage.updatePost(postId, updates);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update post' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    const users = await storage.getAllUsers();
    res.json(users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      planId: user.planId,
      subscriptionStatus: user.subscriptionStatus,
      createdAt: user.createdAt
    })));
  });

  app.get('/api/admin/dashboard-stats', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    const users = await storage.getAllUsers();
    const posts = await storage.getAllPosts();
    const payments = await storage.getPaymentsByUser(req.user!.id);
    
    res.json({
      totalUsers: users.filter(u => u.role !== 'admin').length,
      totalPosts: posts.length,
      scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
      postedPosts: posts.filter(p => p.status === 'posted').length,
      activeSubscriptions: users.filter(u => u.subscriptionStatus === 'active').length
    });
  });

  // User dashboard stats
  app.get('/api/dashboard/stats', authenticateToken, async (req: AuthRequest, res) => {
    const posts = await storage.getPostsByUser(req.user!.id);
    const user = await storage.getUser(req.user!.id);
    let plan = null;
    
    if (user?.planId) {
      plan = await storage.getPlan(user.planId);
    }
    
    res.json({
      totalPosts: posts.length,
      scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
      postedPosts: posts.filter(p => p.status === 'posted').length,
      draftPosts: posts.filter(p => p.status === 'draft').length,
      plan: plan,
      postsRemaining: plan ? plan.postsLimit - posts.length : 0
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
