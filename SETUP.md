# ContentGist Setup Guide

## 🚀 Quick Start

ContentGist is a full-stack social media management platform built with React, TypeScript, Node.js, and PostgreSQL. Follow this guide to set up the application locally and deploy it to production.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Git**

## 🔧 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/contentgist.git
cd contentgist
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Required for basic functionality
DATABASE_URL="postgresql://username:password@localhost:5432/contentgist"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
SESSION_SECRET="your-session-secret-change-this-in-production"
CLIENT_URL="http://localhost:5173"

# Required for email verification
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Optional: Add other services as needed
```

### 4. Set Up Database

Create a PostgreSQL database and run migrations:

```bash
# Create database
createdb contentgist

# Push database schema
npm run db:push
```

### 5. Start Development Servers

Start both the backend and frontend:

```bash
# Start backend (runs on port 3000)
npm run dev

# In another terminal, start frontend (runs on port 5173)
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this app password in your `SMTP_PASS` environment variable

### Other Email Providers

For other SMTP providers, update the configuration:

```env
# Example for SendGrid
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"

# Example for Mailgun
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="your-mailgun-smtp-username"
SMTP_PASS="your-mailgun-smtp-password"
```

## 🔐 Social Media API Setup

### Facebook/Instagram

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login and Instagram Basic Display products
4. Get your App ID and App Secret

### Twitter

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Generate API keys and bearer token

### LinkedIn

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Request access to LinkedIn API
4. Get your Client ID and Client Secret

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create credentials (OAuth 2.0 Client ID)

## 💳 Payment Setup (Stripe)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your publishable and secret keys
3. Set up webhook endpoints for subscription events

## 📊 Database Schema

The application uses Drizzle ORM with PostgreSQL. Key tables include:

- `users` - User accounts with email verification
- `posts` - Social media posts and scheduling
- `social_accounts` - Connected social media accounts
- `plans` - Subscription plans
- `payments` - Payment records
- `analytics` - Social media analytics data

## 🌐 Production Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

### Deploy to Digital Ocean App Platform

1. Create a new app in Digital Ocean
2. Connect your GitHub repository
3. Set environment variables
4. Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`

### Environment Variables for Production

Make sure to set these in your production environment:

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
SESSION_SECRET=your_production_session_secret
CLIENT_URL=https://your-domain.com
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Change all default secrets and passwords
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS in production
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Use strong JWT secrets (64+ characters)
- [ ] Enable database SSL in production
- [ ] Set up monitoring and logging
- [ ] Regular security updates

### Database Security

```sql
-- Create a dedicated database user with limited permissions
CREATE USER contentgist_app WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE contentgist TO contentgist_app;
GRANT USAGE ON SCHEMA public TO contentgist_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO contentgist_app;
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance Optimization

### Database Optimization

1. Add indexes for frequently queried columns
2. Use connection pooling
3. Implement query optimization
4. Regular database maintenance

### Frontend Optimization

1. Code splitting with React lazy loading
2. Image optimization
3. CDN for static assets
4. Bundle analysis and optimization

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if PostgreSQL is running
pg_isready

# Check connection string format
DATABASE_URL="postgresql://user:password@host:port/database"
```

**Email Not Sending**
- Verify SMTP credentials
- Check firewall settings
- Ensure app passwords are used for Gmail
- Test with a simple SMTP client

**Social Media API Errors**
- Verify API keys and secrets
- Check rate limits
- Ensure proper redirect URLs
- Review API documentation for changes

### Logs and Debugging

Check application logs:

```bash
# Development logs
npm run dev

# Production logs (if using PM2)
pm2 logs contentgist

# Database logs
tail -f /var/log/postgresql/postgresql.log
```

## 📞 Support

For issues and questions:

- Create an issue on GitHub
- Check the documentation
- Review common troubleshooting steps
- Contact support: support@contentgist.com

## 🔄 Updates and Maintenance

### Regular Updates

1. Keep dependencies updated
2. Monitor security advisories
3. Regular database backups
4. Performance monitoring
5. User feedback integration

### Backup Strategy

```bash
# Database backup
pg_dump contentgist > backup_$(date +%Y%m%d).sql

# Automated backups with cron
0 2 * * * pg_dump contentgist > /backups/contentgist_$(date +\%Y\%m\%d).sql
```

## 📈 Scaling

### Horizontal Scaling

1. Load balancer setup
2. Multiple application instances
3. Database read replicas
4. CDN for static content
5. Redis for session storage

### Monitoring

Set up monitoring with:
- Application performance monitoring (APM)
- Database monitoring
- Error tracking (Sentry)
- Uptime monitoring
- Log aggregation

---

Ready to elevate your social media game? Start building with ContentGist! 🚀