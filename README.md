# ContentGist - Social Media Management SaaS Platform

A full-stack social media management platform built with React, Express, and TypeScript. Features a modern landing page with SaaS functionality including user authentication, subscription management, post scheduling, and admin dashboard.

## 🚀 Features

### Landing Page
- Modern, responsive design with smooth animations
- Hero section with dynamic CTAs based on authentication state  
- Services showcase and portfolio display
- Customer testimonials and contact forms
- Email integration via EmailJS

### SaaS Platform
- **User Authentication**: Secure registration and login system
- **Subscription Management**: Stripe integration with multiple pricing tiers
- **Post Scheduling**: Automated content scheduling with cron jobs
- **User Dashboard**: Track posts, view analytics, and manage account
- **Admin Dashboard**: Manage users, create posts, and view platform stats
- **Real-time Updates**: Live status updates for scheduled posts

### Plans Available
- **Basic Plan**: $9.99/month - 10 posts per month
- **Pro Plan**: $29.99/month - 50 posts per month  
- **Premium Plan**: $99.99/month - 200 posts per month

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** + **shadcn/ui** components
- **Wouter** for routing
- **TanStack Query** for server state management
- **EmailJS** for client-side email functionality

### Backend  
- **Express.js** with TypeScript
- **JWT** authentication with bcrypt password hashing
- **Stripe** for payment processing
- **Node-cron** for automated post scheduling
- **In-memory storage** (easily replaceable with PostgreSQL)

### Development
- **Vite** for fast development and building
- **TypeScript** with strict configuration
- **ESLint** and **Prettier** for code quality

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd content-gist
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (optional)
```bash
# Create .env file
DATABASE_URL=your_postgresql_url  # Optional - uses in-memory storage by default
STRIPE_SECRET_KEY=your_stripe_secret_key  # For payment processing
JWT_SECRET=your_jwt_secret  # For authentication
```

4. Start the development server
```bash
npm run dev
```

5. Open http://localhost:5000 in your browser

## 📝 Usage

### For End Users
1. **Sign Up**: Create an account at `/register`
2. **Choose Plan**: Select a subscription at `/pricing`  
3. **Dashboard**: View and manage your scheduled posts at `/dashboard`
4. **Payment**: Complete subscription via Stripe checkout

### For Administrators
1. **Login**: Use admin credentials (admin@contentgist.com / password)
2. **Admin Dashboard**: Access admin panel at `/admin`
3. **User Management**: View all users and their subscription status
4. **Content Creation**: Create and schedule posts for users
5. **Analytics**: Monitor platform usage and statistics

## 🗂 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages/routes
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── lib/            # Utility functions
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application  
│   ├── auth.ts            # Authentication middleware
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage interface
│   └── scheduler.ts       # Post scheduling logic
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Database schemas and types
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get user's posts (or all posts for admin)
- `POST /api/posts` - Create new post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)

### Plans & Payments
- `GET /api/plans` - Get available subscription plans
- `POST /api/payments/create-checkout-session` - Create Stripe checkout

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/dashboard-stats` - Get platform statistics (admin only)

## 🔐 Default Admin Account

For testing purposes, a default admin account is created:
- **Email**: admin@contentgist.com
- **Password**: password

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

The application will serve both the API and static frontend files on port 5000.

### Environment Setup
- Configure `DATABASE_URL` for PostgreSQL in production
- Set `STRIPE_SECRET_KEY` for payment processing
- Set secure `JWT_SECRET` for authentication
- Configure EmailJS credentials for contact forms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support or questions, contact: ibrahim@contentgist.com

---

Built with ❤️ by the ContentGist team