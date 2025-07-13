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
import { sendVerificationEmail, sendPasswordResetEmail, verifyEmailConfig } from "./email";
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2023-10-16',
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the post scheduler
  startScheduler();

  // Verify email configuration
  await verifyEmailConfig();

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

      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Hash password and create user with verification token
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({ 
        email, 
        password: hashedPassword, 
        name,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      });

      // Send verification email
      const emailSent = await sendVerificationEmail(email, verificationToken);
      if (!emailSent) {
        console.error('Failed to send verification email');
      }
      
      res.json({ 
        message: 'Registration successful! Please check your email to verify your account.',
        requiresVerification: true
      });
    } catch (error) {
      console.error('Registration error:', error);
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

      // Check if email is verified
      if (!user.emailVerified) {
        return res.status(401).json({ 
          message: 'Please verify your email address before logging in.',
          requiresVerification: true 
        });
      }

      const token = generateToken(user.id, user.email, user.role);
      
      res.json({ 
        token, 
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ message: 'Login failed' });
    }
  });

  // Email verification route
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
      }

      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }

      // Check if token has expired
      if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
        return res.status(400).json({ message: 'Verification token has expired' });
      }

      // Update user to verified
      await storage.verifyUserEmail(user.id);

      const authToken = generateToken(user.id, user.email, user.role);
      
      res.json({ 
        message: 'Email verified successfully!',
        token: authToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(400).json({ message: 'Email verification failed' });
    }
  });

  // Resend verification email
  app.post('/api/auth/resend-verification', async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: 'Email is already verified' });
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.updateVerificationToken(user.id, verificationToken, verificationExpires);

      // Send verification email
      const emailSent = await sendVerificationEmail(email, verificationToken);
      if (!emailSent) {
        return res.status(500).json({ message: 'Failed to send verification email' });
      }

      res.json({ message: 'Verification email sent successfully!' });
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(400).json({ message: 'Failed to resend verification email' });
    }
  });

  // Request password reset
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      }

      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await storage.updatePasswordResetToken(user.id, resetToken, resetExpires);

      // Send password reset email
      const emailSent = await sendPasswordResetEmail(email, resetToken);
      if (!emailSent) {
        console.error('Failed to send password reset email');
      }

      res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(400).json({ message: 'Failed to process password reset request' });
    }
  });

  // Reset password
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: 'Token and new password are required' });
      }

      const user = await storage.getUserByPasswordResetToken(token);
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      // Check if token has expired
      if (user.passwordResetExpires && new Date() > user.passwordResetExpires) {
        return res.status(400).json({ message: 'Reset token has expired' });
      }

      // Hash new password and update user
      const hashedPassword = await hashPassword(password);
      await storage.updatePassword(user.id, hashedPassword);

      res.json({ message: 'Password reset successful! You can now log in with your new password.' });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(400).json({ message: 'Failed to reset password' });
    }
  });

  // Get user's plan information
  app.get('/api/user/plan', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let plan = null;
      if (user.planId) {
        plan = await storage.getPlan(user.planId);
      } else {
        // Get default plan if user has no plan
        const plans = await storage.getAllPlans();
        plan = plans.find(p => p.name === 'Basic') || plans[0];
      }

      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }

      // Add account limits and features based on plan
      const planWithLimits = {
        ...plan,
        accountsLimit: plan.name === 'Basic' ? 2 : plan.name === 'Pro' ? 5 : 10,
        features: [
          `Up to ${plan.postsLimit} posts per month`,
          `${plan.name === 'Basic' ? 2 : plan.name === 'Pro' ? 5 : 10} social media accounts`,
          'Automated posting',
          'Content scheduling',
          ...(plan.name !== 'Basic' ? ['Analytics dashboard', 'Priority support'] : []),
          ...(plan.name === 'Enterprise' ? ['Custom integrations', 'Dedicated manager'] : [])
        ]
      };

      res.json(planWithLimits);
    } catch (error) {
      console.error('Get user plan error:', error);
      res.status(500).json({ message: 'Failed to get user plan' });
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
      subscriptionStatus: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId
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

  app.delete('/api/posts/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Only allow deletion of non-posted content
      if (post.status === 'posted') {
        return res.status(400).json({ message: 'Cannot delete published posts' });
      }

      await storage.deletePost(postId);
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Failed to delete post' });
    }
  });

  app.post('/api/posts/:id/publish', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Try to publish manually
      const socialAccounts = await storage.getSocialAccountsByUser(post.userId);
      const connectedPlatforms = socialAccounts
        .filter(account => account.isActive)
        .map(account => account.platform.toLowerCase());
      
      const requestedPlatforms = (post.platforms || []).map(p => p.toLowerCase());
      const availablePlatforms = requestedPlatforms.filter(platform => 
        connectedPlatforms.includes(platform)
      );

      if (availablePlatforms.length === 0) {
        return res.status(400).json({ message: 'No connected social accounts for this post\'s platforms' });
      }

      // Import socialMediaService
      const { socialMediaService } = await import('./socialMediaService');
      
      const publishResults = await socialMediaService.publishPost(
        post.userId,
        {
          content: post.content,
          mediaUrls: post.mediaUrls || [],
          hashtags: post.hashtags || [],
          scheduledAt: post.scheduledAt
        },
        availablePlatforms
      );
      
      const allSuccessful = publishResults.every(result => result.success);
      const updatedPost = await storage.updatePost(postId, {
        status: allSuccessful ? 'posted' : 'failed',
        publishedAt: new Date(),
        publishResults: JSON.stringify(publishResults)
      });

      res.json({ message: 'Post published successfully', post: updatedPost, results: publishResults });
    } catch (error) {
      console.error('Error publishing post:', error);
      res.status(500).json({ message: 'Failed to publish post' });
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

  // Admin route to get all clients with their social accounts and post stats
  app.get('/api/admin/clients-overview', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const users = await storage.getAllUsers();
      const allPosts = await storage.getAllPosts();
      const plans = await storage.getAllPlans();
      
      // Filter out admin users
      const clients = users.filter(user => user.role !== 'admin');
      
      // Get detailed info for each client
      const clientsWithDetails = await Promise.all(
        clients.map(async (client) => {
          // Get social accounts for this client
          const socialAccounts = await storage.getSocialAccountsByUser(client.id);
          
          // Get post stats for this client
          const clientPosts = allPosts.filter(post => post.userId === client.id);
          const postStats = {
            total: clientPosts.length,
            scheduled: clientPosts.filter(p => p.status === 'scheduled').length,
            posted: clientPosts.filter(p => p.status === 'posted').length,
            pending: clientPosts.filter(p => p.status === 'pending_approval').length,
            approved: clientPosts.filter(p => p.status === 'approved').length
          };
          
          // Get plan info
          const plan = client.planId ? plans.find(p => p.id === client.planId) : null;
          
          return {
            ...client,
            socialAccounts: socialAccounts.map(account => ({
              id: account.id,
              platform: account.platform,
              accountName: account.accountName,
              isActive: account.isActive,
              createdAt: account.createdAt
            })),
            postStats,
            plan: plan ? { name: plan.name, postsLimit: plan.postsLimit } : null
          };
        })
      );
      
      res.json(clientsWithDetails);
    } catch (error) {
      console.error('Error fetching clients overview:', error);
      res.status(500).json({ message: 'Failed to fetch clients overview' });
    }
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

  // Calendar API endpoints
  app.get('/api/calendar/posts', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { start, end } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ message: 'Start and end dates are required' });
      }
      
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      
      let posts;
      if (req.user!.role === 'admin') {
        posts = await storage.getPostsByDateRange(startDate, endDate);
      } else {
        const allPosts = await storage.getPostsByUser(req.user!.id);
        posts = allPosts.filter(post => {
          if (!post.scheduledAt) return false;
          const scheduledDate = new Date(post.scheduledAt);
          return scheduledDate >= startDate && scheduledDate <= endDate;
        });
      }
      
      // Transform posts for calendar format
      const calendarEvents = posts.map(post => ({
        id: post.id,
        title: post.title,
        start: post.scheduledAt,
        end: post.scheduledAt,
        status: post.status,
        content: post.content,
        userId: post.userId,
        platforms: post.platforms,
        resource: post.status // For grouping by status
      }));
      
      res.json(calendarEvents);
    } catch (error) {
      console.error('Error fetching calendar posts:', error);
      res.status(500).json({ message: 'Failed to fetch calendar posts' });
    }
  });

  // OAuth routes for social media connections
  app.get('/api/auth/connect/:platform', authenticateToken, async (req: AuthRequest, res) => {
    const platform = req.params.platform;
    const userId = req.user!.id;
    
    // Create OAuth URLs (these would need actual app credentials)
    const oauthUrls = {
      facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_FACEBOOK_APP_ID&redirect_uri=${encodeURIComponent(`${req.protocol}://${req.get('host')}/api/auth/callback/facebook`)}&scope=pages_manage_posts,pages_read_engagement&response_type=code&state=${userId}`,
      instagram: `https://api.instagram.com/oauth/authorize?client_id=YOUR_INSTAGRAM_CLIENT_ID&redirect_uri=${encodeURIComponent(`${req.protocol}://${req.get('host')}/api/auth/callback/instagram`)}&scope=user_profile,user_media&response_type=code&state=${userId}`,
      twitter: `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=YOUR_TWITTER_CLIENT_ID&redirect_uri=${encodeURIComponent(`${req.protocol}://${req.get('host')}/api/auth/callback/twitter`)}&scope=tweet.read%20tweet.write%20users.read&state=${userId}`,
      linkedin: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_LINKEDIN_CLIENT_ID&redirect_uri=${encodeURIComponent(`${req.protocol}://${req.get('host')}/api/auth/callback/linkedin`)}&scope=w_member_social&state=${userId}`,
      youtube: `https://accounts.google.com/o/oauth2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=${encodeURIComponent(`${req.protocol}://${req.get('host')}/api/auth/callback/youtube`)}&scope=https://www.googleapis.com/auth/youtube.upload&response_type=code&access_type=offline&state=${userId}`
    };
    
    const oauthUrl = oauthUrls[platform as keyof typeof oauthUrls];
    if (!oauthUrl) {
      return res.status(400).json({ message: 'Unsupported platform' });
    }
    
    res.redirect(oauthUrl);
  });

  // OAuth callback handlers (for demonstration)
  app.get('/api/auth/callback/:platform', async (req, res) => {
    const platform = req.params.platform;
    const { code, error, state } = req.query;
    const userId = parseInt(state as string);
    
    if (error || !code || !userId) {
      return res.redirect(`/?error=oauth_failed&platform=${platform}`);
    }
    
    try {
      // For demonstration, create a mock connected account
      // In production, you'd exchange the code for access tokens here
      await storage.createSocialAccount({
        userId: userId,
        platform: platform,
        accountName: `Demo ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
        accessToken: `demo_token_${Date.now()}`,
        refreshToken: null,
        expiresAt: null,
        isActive: true
      });
      
      res.redirect(`/?success=connected&platform=${platform}`);
    } catch (error) {
      console.error(`OAuth error for ${platform}:`, error);
      res.redirect(`/?error=connection_failed&platform=${platform}`);
    }
  });

  // Demo endpoint for creating mock social accounts
  app.post('/api/auth/callback/demo', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { platform, accountName } = req.body;
      const userId = req.user!.id;
      
      await storage.createSocialAccount({
        userId: userId,
        platform: platform,
        accountName: accountName || `Demo ${platform} Account`,
        accessToken: `demo_token_${Date.now()}`,
        refreshToken: null,
        expiresAt: null,
        isActive: true
      });
      
      res.json({ success: true, message: 'Demo account connected successfully' });
    } catch (error) {
      console.error('Demo connection error:', error);
      res.status(500).json({ message: 'Failed to create demo connection' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
