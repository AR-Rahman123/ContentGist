# ContentGist Social Media Management Platform

## Overview

This is a full-stack social media management platform built with React, Express, and TypeScript. The application features a modern landing page for a social media agency called ContentGist, with consultation booking functionality and email integration. The project uses a monorepo structure with shared TypeScript types and a PostgreSQL database configured with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite with React plugin
- **UI Components**: Radix UI primitives with custom styling
- **Email Integration**: EmailJS for client-side email sending
- **State Management**: React hooks for local component state

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution
- **Build**: esbuild for production bundling
- **API Structure**: RESTful API with /api prefix

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Provider**: Neon Database serverless PostgreSQL
- **Schema**: Centralized schema definitions in shared directory
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Frontend Components
- **Landing Page**: Modern, responsive design with smooth scrolling
- **Header**: Fixed navigation with smooth scroll to sections
- **Hero Section**: Call-to-action with consultation modal
- **Services**: Grid layout showcasing service offerings
- **Portfolio**: Project showcase with detailed modals
- **Testimonials**: Auto-rotating customer testimonials
- **Contact**: Contact form with email integration
- **Consultation Modal**: Popup form for consultation requests

### Backend Components
- **Express Server**: Main application server with middleware
- **Route Registration**: Centralized route management
- **Storage Interface**: Abstract storage layer with in-memory implementation
- **Vite Integration**: Development server integration for HMR

### Shared Components
- **Schema Definitions**: Database table schemas with Zod validation
- **Type Safety**: Shared TypeScript types between frontend and backend

## Data Flow

### Client-Side Data Flow
1. User interactions trigger React component state updates
2. Form submissions validate data locally before sending
3. EmailJS handles consultation form submissions directly to email
4. Contact forms send data to backend API endpoints
5. React Query could be used for server state management (configured but not actively used)

### Server-Side Data Flow
1. Express middleware handles request parsing and logging
2. Routes process API requests and interact with storage layer
3. Storage interface abstracts database operations
4. Error handling middleware catches and formats errors
5. Responses sent back to client with appropriate status codes

### Database Flow
1. Drizzle ORM provides type-safe database queries
2. Schema definitions ensure data consistency
3. Migrations handle database structure changes
4. Connection pooling through Neon serverless driver

## External Dependencies

### Production Dependencies
- **UI Framework**: React, Radix UI components
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Email**: EmailJS for client-side email functionality
- **Validation**: Zod for runtime type validation
- **Utilities**: date-fns for date manipulation, clsx for className utilities

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full TypeScript setup with strict configuration
- **Tooling**: Drizzle Kit for database management

### Email Service Integration
- **Provider**: EmailJS (client-side email service)
- **Configuration**: Service ID, Template ID, and Public Key required
- **Templates**: Email templates configured in EmailJS dashboard
- **Recipient**: ibrahim@contentgist.com for consultation requests

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Static Assets**: Frontend assets served by Express in production

### Environment Configuration
- **Development**: Uses tsx for TypeScript execution with HMR
- **Production**: Compiled JavaScript execution with static file serving
- **Database**: Requires DATABASE_URL environment variable
- **Email**: EmailJS credentials configured in client-side service

### Production Setup
1. Database provisioning with Neon or compatible PostgreSQL service
2. Environment variables configuration for database connection
3. Static file serving through Express for the built React application
4. Single server deployment serving both API and frontend

### Development Workflow
1. `npm run dev` starts development server with hot reload
2. `npm run db:push` applies schema changes to database
3. `npm run build` creates production build
4. `npm start` runs production server

The architecture supports both development and production environments with a clear separation of concerns between frontend, backend, and database layers. The shared schema approach ensures type safety across the full stack while maintaining flexibility for future enhancements.