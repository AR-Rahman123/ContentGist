import express from 'express';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { storage } from './storage';
import type { AuthRequest } from './auth';

const router = express.Router();

// OAuth callback URLs
const CALLBACK_URLS = {
  facebook: `${process.env.APP_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
  google: `${process.env.APP_URL || 'http://localhost:5000'}/api/auth/google/callback`,
  twitter: `${process.env.APP_URL || 'http://localhost:5000'}/api/auth/twitter/callback`,
  linkedin: `${process.env.APP_URL || 'http://localhost:5000'}/api/auth/linkedin/callback`,
};

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use('facebook-connect', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: CALLBACK_URLS.facebook,
    profileFields: ['id', 'displayName', 'email', 'accounts'],
    scope: ['pages_manage_posts', 'pages_read_engagement', 'instagram_basic', 'instagram_content_publish']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Store user ID in session for later use
      return done(null, { 
        platform: 'facebook', 
        accessToken, 
        refreshToken,
        profile 
      });
    } catch (error) {
      return done(error);
    }
  }));
}

// Google OAuth Strategy (for YouTube)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use('google-connect', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URLS.google,
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.upload']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      return done(null, { 
        platform: 'youtube', 
        accessToken, 
        refreshToken,
        profile 
      });
    } catch (error) {
      return done(error);
    }
  }));
}

// Twitter OAuth Strategy
if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET) {
  passport.use('twitter-connect', new TwitterStrategy({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: CALLBACK_URLS.twitter,
    includeEmail: true
  }, async (token, tokenSecret, profile, done) => {
    try {
      return done(null, { 
        platform: 'twitter', 
        accessToken: token, 
        refreshToken: tokenSecret,
        profile 
      });
    } catch (error) {
      return done(error);
    }
  }));
}

// LinkedIn OAuth Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use('linkedin-connect', new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: CALLBACK_URLS.linkedin,
    scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      return done(null, { 
        platform: 'linkedin', 
        accessToken, 
        refreshToken,
        profile 
      });
    } catch (error) {
      return done(error);
    }
  }));
}

// OAuth initiation routes
router.get('/connect/facebook', passport.authenticate('facebook-connect'));
router.get('/connect/google', passport.authenticate('google-connect'));
router.get('/connect/twitter', passport.authenticate('twitter-connect'));
router.get('/connect/linkedin', passport.authenticate('linkedin-connect'));

// OAuth callback routes
router.get('/facebook/callback', 
  passport.authenticate('facebook-connect', { session: false }),
  async (req: AuthRequest, res) => {
    try {
      const { platform, accessToken, refreshToken, profile } = req.user as any;
      
      if (!req.user || !req.user.id) {
        return res.redirect('/login?error=authentication_required');
      }

      // Save social account to database
      await storage.createSocialAccount({
        userId: req.user.id,
        platform,
        accountId: profile.id,
        accountName: profile.displayName,
        accessToken,
        refreshToken,
        expiresAt: null // Facebook tokens don't expire
      });

      res.redirect('/dashboard?connected=facebook');
    } catch (error) {
      console.error('Facebook OAuth callback error:', error);
      res.redirect('/dashboard?error=connection_failed');
    }
  }
);

router.get('/google/callback',
  passport.authenticate('google-connect', { session: false }),
  async (req: AuthRequest, res) => {
    try {
      const { platform, accessToken, refreshToken, profile } = req.user as any;
      
      if (!req.user || !req.user.id) {
        return res.redirect('/login?error=authentication_required');
      }

      await storage.createSocialAccount({
        userId: req.user.id,
        platform,
        accountId: profile.id,
        accountName: profile.displayName,
        accessToken,
        refreshToken,
        expiresAt: null // Will be set based on token info
      });

      res.redirect('/dashboard?connected=youtube');
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect('/dashboard?error=connection_failed');
    }
  }
);

router.get('/twitter/callback',
  passport.authenticate('twitter-connect', { session: false }),
  async (req: AuthRequest, res) => {
    try {
      const { platform, accessToken, refreshToken, profile } = req.user as any;
      
      if (!req.user || !req.user.id) {
        return res.redirect('/login?error=authentication_required');
      }

      await storage.createSocialAccount({
        userId: req.user.id,
        platform,
        accountId: profile.id,
        accountName: profile.username,
        accessToken,
        refreshToken,
        expiresAt: null
      });

      res.redirect('/dashboard?connected=twitter');
    } catch (error) {
      console.error('Twitter OAuth callback error:', error);
      res.redirect('/dashboard?error=connection_failed');
    }
  }
);

router.get('/linkedin/callback',
  passport.authenticate('linkedin-connect', { session: false }),
  async (req: AuthRequest, res) => {
    try {
      const { platform, accessToken, refreshToken, profile } = req.user as any;
      
      if (!req.user || !req.user.id) {
        return res.redirect('/login?error=authentication_required');
      }

      await storage.createSocialAccount({
        userId: req.user.id,
        platform,
        accountId: profile.id,
        accountName: profile.displayName,
        accessToken,
        refreshToken,
        expiresAt: null
      });

      res.redirect('/dashboard?connected=linkedin');
    } catch (error) {
      console.error('LinkedIn OAuth callback error:', error);
      res.redirect('/dashboard?error=connection_failed');
    }
  }
);

export default router;