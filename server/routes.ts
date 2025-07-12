import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateToken, requireAdmin, hashPassword, comparePassword, generateToken, type AuthRequest } from "./auth";
import { insertUserSchema, insertPostSchema } from "@shared/schema";
import { startScheduler } from "./scheduler";
import { socialMediaService } from "./socialMediaService";
import oauthRoutes from "./oauth";
import passport from "passport";
import session from "express-session";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2023-10-16',
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the post scheduler
  startScheduler();

  // Initialize passport and session for OAuth
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // OAuth routes
  app.use('/api/auth', oauthRoutes);

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

  // Social Media Account routes
  app.get('/api/social-accounts', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const accounts = await storage.getSocialAccountsByUser(userId);
      // Don't return sensitive token data to client
      const sanitizedAccounts = accounts.map(account => ({
        id: account.id,
        platform: account.platform,
        accountName: account.accountName,
        isActive: account.isActive,
        createdAt: account.createdAt
      }));
      res.json(sanitizedAccounts);
    } catch (error) {
      console.error('Error fetching social accounts:', error);
      res.status(500).json({ message: 'Failed to fetch social accounts' });
    }
  });

  app.delete('/api/social-accounts/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const accountId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Verify the account belongs to the user
      const accounts = await storage.getSocialAccountsByUser(userId);
      const account = accounts.find(acc => acc.id === accountId);
      
      if (!account) {
        return res.status(404).json({ message: 'Social account not found' });
      }
      
      await storage.deleteSocialAccount(accountId);
      res.json({ message: 'Social account disconnected successfully' });
    } catch (error) {
      console.error('Error disconnecting social account:', error);
      res.status(500).json({ message: 'Failed to disconnect social account' });
    }
  });

  // Analytics routes
  app.get('/api/analytics', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const analytics = await storage.getLatestAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });

  // Client route to update post status (approve/reject)
  app.patch('/api/posts/:id/status', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { status, rejectionReason } = req.body;
      const userId = req.user!.id;
      
      // Get the post
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Check if user is the owner of the post
      if (post.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Update post status
      const updates: any = { status };
      if (status === 'approved') {
        updates.approvedBy = userId;
      } else if (status === 'rejected') {
        updates.rejectionReason = rejectionReason;
      }
      
      const updatedPost = await storage.updatePost(postId, updates);
      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating post status:', error);
      res.status(500).json({ message: 'Failed to update post status' });
    }
  });

  // Admin route to publish approved posts
  app.post('/api/posts/:id/publish', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      if (post.status !== 'approved') {
        return res.status(400).json({ message: 'Post must be approved before publishing' });
      }
      
      // Publish to social media platforms
      const publishResults = await socialMediaService.publishPost(post.userId, {
        content: post.content,
        mediaUrls: post.mediaUrls || [],
        hashtags: post.hashtags || [],
        scheduledAt: post.scheduledAt || undefined
      }, post.platforms || []);
      
      // Update post with publish results
      await storage.updatePost(postId, {
        status: 'posted',
        publishedAt: new Date(),
        publishResults: JSON.stringify(publishResults)
      });
      
      res.json({ message: 'Post published successfully', results: publishResults });
    } catch (error) {
      console.error('Error publishing post:', error);
      res.status(500).json({ message: 'Failed to publish post' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
