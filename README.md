# ContentGist - Social Media Management Platform

<div align="center">
  <h3>🚀 Elevate Your Social Media Presence</h3>
  <p>A modern, full-stack social media management platform that simplifies content creation, scheduling, and analytics across all major social platforms.</p>
  
  <p>
    <a href="https://contentgist.com">🌐 Live Demo</a> •
    <a href="#quick-start">⚡ Quick Start</a> •
    <a href="SETUP.md">📚 Setup Guide</a> •
    <a href="#features">✨ Features</a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
  </p>
</div>

## ✨ Features

### 🎯 Core Functionality
- **Multi-Platform Management** - Connect and manage Facebook, Instagram, Twitter, LinkedIn, and YouTube accounts
- **Smart Scheduling** - Schedule posts across all platforms with optimal timing suggestions
- **Content Creation** - Built-in tools for creating engaging social media content
- **Analytics Dashboard** - Comprehensive insights into post performance and audience engagement
- **Team Collaboration** - Invite team members with role-based permissions

### 🔐 Security & Authentication
- **Email Verification** - Secure account creation with email confirmation required before login
- **Password Reset** - Complete password recovery flow with secure token-based reset
- **JWT Authentication** - Secure token-based authentication with refresh capabilities
- **OAuth Integration** - Login with Google, Facebook, and other social providers
- **Role-Based Access** - Admin and user roles with appropriate permissions and route protection

### 💳 Business Features
- **Subscription Management** - Flexible pricing plans with Stripe integration
- **Payment Processing** - Secure payment handling and automated billing
- **Usage Analytics** - Track plan usage and feature utilization
- **API Rate Limiting** - Intelligent rate limiting for external API calls

### 🎨 User Experience
- **Modern UI** - Beautiful, responsive design with Tailwind CSS and shadcn/ui
- **Full Page Navigation** - Dedicated About, Privacy Policy, and Terms of Service pages
- **Mobile Responsive** - Perfect experience on desktop, tablet, and mobile
- **Real-time Updates** - Live notifications and status updates
- **Intuitive Forms** - Enhanced error handling and loading states throughout

### 📧 Communication
- **Transactional Emails** - Beautiful HTML email templates for verification and password reset
- **Email Service Integration** - Full nodemailer setup with SMTP configuration
- **Multi-Provider Support** - Works with Gmail, SendGrid, Mailgun, and other providers

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for lightning-fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **TanStack Query** for efficient data fetching and caching
- **Wouter** for lightweight client-side routing
- **Framer Motion** for smooth animations

### Backend
- **Node.js** with Express.js for robust API development
- **TypeScript** for type safety across the entire stack
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** for reliable data storage with full schema
- **Passport.js** for authentication strategies
- **JWT** for secure session management
- **Nodemailer** for transactional emails
- **Stripe** for payment processing

### Infrastructure
- **Neon** for serverless PostgreSQL hosting
- **Vercel** ready for frontend deployment
- **Railway** ready for backend deployment
- **Environment-based configuration** for all services

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/contentgist.git
cd contentgist

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your actual values (see SETUP.md for details)

# 4. Set up the database
npm run db:push

# 5. Start development servers
npm run dev
```

Visit http://localhost:5173 to see your application running!

For detailed setup instructions, see [SETUP.md](SETUP.md).

## � Database Schema

ContentGist uses a comprehensive PostgreSQL database with the following entities:

- **Users** - Complete user management with email verification, password reset tokens, and role-based access
- **Posts** - Content management with multi-platform scheduling and status tracking
- **Social Accounts** - Connected platform accounts with secure encrypted token storage
- **Plans & Payments** - Full subscription management and billing history
- **Analytics** - Performance metrics and engagement data across platforms

### Key Schema Features
- Email verification with expiring tokens
- Password reset with secure token handling
- Encrypted social media tokens
- Comprehensive audit trails
- Optimized indexes for performance

## 🌐 API Documentation

### Authentication Endpoints
```
POST /api/auth/register           # User registration with email verification
POST /api/auth/login             # User login (requires verified email)
POST /api/auth/verify-email      # Email verification with token
POST /api/auth/resend-verification # Resend verification email
POST /api/auth/forgot-password   # Password reset request
POST /api/auth/reset-password    # Password reset with token
GET  /api/auth/me               # Get current user profile
```

### Content Management
```
GET    /api/posts               # Get user's posts
POST   /api/posts               # Create new post
PUT    /api/posts/:id           # Update post
DELETE /api/posts/:id           # Delete post
POST   /api/posts/:id/schedule  # Schedule post across platforms
```

### Analytics & Insights
```
GET /api/analytics/overview     # Dashboard overview with key metrics
GET /api/analytics/posts        # Post performance data
GET /api/analytics/audience     # Audience insights and demographics
GET /api/analytics/trends       # Trending hashtags and content
```

### Subscription Management
```
GET  /api/plans                 # Get available subscription plans
POST /api/payments/checkout     # Create Stripe checkout session
GET  /api/user/plan            # Get user's current plan and usage
POST /api/payments/webhook     # Stripe webhook handler
```

## � Pages & Navigation

### Public Pages
- **Home** (`/`) - Landing page with hero, features, testimonials
- **About** (`/about`) - Company information, team, mission, and values
- **Pricing** (`/pricing`) - Subscription plans and feature comparison
- **Contact** (`/contact`) - Contact form and company information
- **Privacy Policy** (`/privacy`) - Comprehensive privacy policy
- **Terms of Service** (`/terms`) - Detailed terms and conditions

### Authentication Pages
- **Login** (`/login`) - User login with forgot password link
- **Register** (`/register`) - User registration with email verification
- **Verify Email** (`/verify-email`) - Email verification handler
- **Forgot Password** (`/forgot-password`) - Password reset request
- **Reset Password** (`/reset-password`) - Password reset form

### Protected Pages
- **Dashboard** (`/dashboard`) - User dashboard with post management
- **Admin Panel** (`/admin`) - Administrative interface (admin only)

## � Deployment

### Environment Variables

Essential production variables:
```bash
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_secure_jwt_secret_64_chars_minimum
SESSION_SECRET=your_secure_session_secret
CLIENT_URL=https://your-domain.com

# Email configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Stripe (optional but recommended)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Quick Deploy Options

#### Deploy to Vercel (Frontend)
```bash
npm i -g vercel
vercel --prod
```

#### Deploy to Railway (Backend)
```bash
npm i -g @railway/cli
railway login
railway deploy
```

See [SETUP.md](SETUP.md) for comprehensive deployment instructions including Netlify, Digital Ocean, and other platforms.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Type checking
npm run check
```

## 📈 Performance & Security

### Performance Features
- **Optimized Database Queries** - Indexed columns and efficient joins
- **Code Splitting** - Lazy loading for optimal bundle sizes
- **Image Optimization** - Responsive images with modern formats
- **Caching Strategy** - Intelligent caching with TanStack Query
- **Bundle Analysis** - Optimized builds with tree shaking

### Security Measures
- **Email Verification Required** - No login without verified email
- **Secure Password Reset** - Time-limited tokens with single use
- **JWT with Expiration** - Secure tokens with reasonable expiry
- **Password Hashing** - bcrypt with proper salt rounds
- **CORS Configuration** - Properly configured cross-origin requests
- **Rate Limiting** - API rate limiting to prevent abuse
- **SQL Injection Prevention** - Parameterized queries via Drizzle ORM

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** and clone your fork
2. **Install dependencies**: `npm install`
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Set up your environment** following SETUP.md
5. **Make your changes** and add tests if needed
6. **Test thoroughly**: `npm test && npm run check`
7. **Commit your changes**: `git commit -m 'Add amazing feature'`
8. **Push to your branch**: `git push origin feature/amazing-feature`
9. **Open a Pull Request** with a clear description

### Development Guidelines

- Follow TypeScript best practices and maintain type safety
- Write tests for new features and bug fixes
- Use conventional commit messages
- Update documentation for user-facing changes
- Ensure all linter checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Acknowledgments

- [React](https://reactjs.org/) for the amazing frontend framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database operations
- [Neon](https://neon.tech/) for serverless PostgreSQL hosting
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- All the amazing open-source libraries that make this project possible

## 📞 Support & Community

- **Documentation**: [SETUP.md](SETUP.md) for comprehensive setup instructions
- **Issues**: [GitHub Issues](https://github.com/your-username/contentgist/issues) for bug reports and feature requests
- **Email**: support@contentgist.com for direct support
- **Privacy**: privacy@contentgist.com for privacy-related questions
- **Legal**: legal@contentgist.com for terms and legal inquiries

---

<div align="center">
  <p>Made with ❤️ by the ContentGist team</p>
  <p>
    <a href="https://contentgist.com">Website</a> •
    <a href="https://twitter.com/contentgist">Twitter</a> •
    <a href="https://linkedin.com/company/contentgist">LinkedIn</a>
  </p>
</div>