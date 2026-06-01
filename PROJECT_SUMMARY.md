
# GovAssist - Project Summary

## Overview
A full-stack Government Assistance & Document Management System built with Next.js 15, TypeScript, Prisma, PostgreSQL, and Tailwind CSS.

## Project Statistics
- **Total Files**: 96
- **Total Lines of Code**: 8,379
- **Technology Stack**: Next.js 15, React 19, TypeScript, Prisma, PostgreSQL, Tailwind CSS, shadcn/ui, NextAuth.js v5

## Architecture

### Frontend (Next.js App Router)
- **Public Pages**: Home, About, Contact, Programs listing
- **Auth Pages**: Login, Register
- **Citizen Portal**: Dashboard, Applications, Documents, Notifications, Schedules
- **Staff Portal**: Dashboard, Applications (review), Search, Schedules
- **Admin Portal**: Dashboard, Users, Staff, Programs, Reports, Audit Logs, Settings

### Backend (Server Actions + API Routes)
- **Authentication**: NextAuth.js v5 with credentials provider, JWT sessions
- **Database**: Prisma ORM with PostgreSQL
- **File Uploads**: UploadThing for document storage
- **Audit Logging**: Automatic tracking of all system actions

### Database Schema
- **Users**: id, fullName, email, username, passwordHash, role, phone, address
- **AssistancePrograms**: id, title, description, requirements, budget, status
- **Applications**: id, userId, programId, status, remarks, submittedAt, reviewedAt
- **Documents**: id, applicationId, fileName, fileUrl, fileType, verified
- **Notifications**: id, userId, title, message, isRead
- **Schedules**: id, applicationId, date, time, location, status
- **AuditLogs**: id, userId, action, targetTable, targetId, ipAddress

## Key Features Implemented

### 1. Authentication & Authorization
- Secure login with bcrypt password hashing
- Role-based access control (Citizen, Staff, Admin)
- Middleware-based route protection
- Session management with JWT
- Automatic audit logging for login/logout

### 2. Citizen Features
- Account registration with validation
- Profile management and password change
- Browse and apply for assistance programs
- Upload supporting documents
- Real-time application status tracking
- Notification system for status updates
- Schedule viewing for claim appointments

### 3. Staff Features
- Dashboard with application statistics
- Review applications with status updates and remarks
- Verify uploaded documents
- Search citizens by name/email/username
- Create and manage claim schedules

### 4. Admin Features
- Full user management (CRUD)
- Staff management
- Program management (CRUD)
- System-wide reports and analytics
- Audit log viewing with pagination
- System settings configuration

### 5. UI/UX
- Responsive design with Tailwind CSS
- shadcn/ui component library (30+ components)
- Dark mode support
- Mobile navigation
- Loading states and empty states
- Toast notifications
- Data tables with search and pagination

### 6. Security
- Input validation with Zod schemas
- CSRF protection via NextAuth
- Role-based middleware protection
- Audit logging for all actions
- Secure file uploads

## File Structure
```
govassist/
├── prisma/              # Database schema & seed data
├── src/
│   ├── app/            # Next.js pages (App Router)
│   │   ├── (auth)/     # Login, Register
│   │   ├── (public)/   # Home, About, Contact, Programs
│   │   ├── (portal)/   # Citizen, Staff, Admin portals
│   │   ├── api/        # API routes (auth, uploadthing)
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx  # Root layout with providers
│   │   └── page.tsx    # Landing page
│   ├── components/
│   │   ├── ui/         # 30+ shadcn/ui components
│   │   ├── layout/     # Navbar, Sidebar, PortalLayout
│   │   └── dashboard/  # StatsCard
│   ├── lib/            # Utilities, Prisma, Auth, UploadThing
│   ├── services/       # Server Actions (auth, programs, applications, admin)
│   ├── hooks/          # use-toast hook
│   ├── types/          # TypeScript interfaces
│   ├── constants/      # App constants
│   ├── validators/     # Zod validation schemas
│   └── middleware.ts   # Route protection
├── public/             # Static assets
└── config files        # package.json, tsconfig, tailwind, etc.
```

## Demo Credentials
| Role    | Email                 | Password    |
|---------|----------------------|-------------|
| Admin   | admin@govassist.gov  | admin123    |
| Staff   | staff@govassist.gov  | staff123    |
| Citizen | jane@example.com     | citizen123  |

## Setup Instructions
1. Clone repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and configure
4. Run `npx prisma migrate dev --name init`
5. Run `npx prisma db seed`
6. Run `npm run dev`
7. Visit http://localhost:3000

## Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run db:migrate` - Database migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Prisma Studio
