# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript inspection management application built with Vite. It's designed for construction/facility inspection workflows with role-based access control (admin, gestor, inspetor) and integrates with Supabase for authentication and data storage.

## Key Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Authentication**: Supabase Auth with JWT tokens
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Testing**: Jest (tests in `/tests/unit/`)

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Lint the code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Authentication System
- Uses Supabase Auth with secure JWT token management
- Role-based access control with three roles: admin, gestor, inspetor
- Session management with auto-refresh and timeout handling
- Security utilities in `/src/utils/` for CSRF protection, rate limiting, encryption

### Component Structure
```
src/components/
├── auth/           # Authentication components
├── admin/          # Admin-only components
├── gestor/         # Manager role components  
├── inspetor/       # Inspector role components
├── layout/         # App layout components
├── security/       # Security initialization
├── shared/         # Reusable components
└── ui/             # shadcn/ui components
```

### Key Contexts
- `AuthContext`: User authentication and session management
- `PermissionsContext`: Role-based permissions
- `VoiceAssistantContext`: Voice features integration

### Security Features
- JWT token validation and refresh handling
- CSRF protection utilities
- Rate limiting implementation
- Secure cookie management
- Input validation and sanitization
- Audit logging system

## Database

Uses Supabase with:
- Row-level security (RLS) policies in `/supabase/rls_policies.sql`
- Database migrations in `/supabase/migrations/`
- Type definitions in `/src/types/`

## Testing

- Unit tests located in `/tests/unit/`
- Focus on security utilities and authentication functions
- Run tests with standard Jest commands

## Path Aliases

Uses `@/*` alias mapping to `./src/*` for cleaner imports.

## Important Notes

- Server runs on port 8080 (not default 5173)
- Environment variables needed: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Role-based routing with protected routes
- Security-first approach with comprehensive validation