# EduSphere LMS — Cloud-Native Learning Management System

EduSphere LMS is a modern, cloud-native Learning Management System designed for multi-tenant training organizations to manage the complete student and course lifecycle.

Built with **Angular 20** on the frontend and **NestJS + Prisma + PostgreSQL + Redis** on the backend.

---

## 🎯 Sprint Progress & Modules

### Completed Sprints:
* **Sprint 0: Foundation & Setup**
  * Monorepo workspaces (`apps/api`, `apps/web`)
  * PostgreSQL & Redis Docker Compose environments
  * Prisma ORM schema and health endpoints
* **Sprint 1: Authentication & Identity**
  * JWT access tokens with rotating refresh tokens
  * Tokenized email verification & password reset flows
  * Login history, audit events, and password bcrypt hashing
* **Sprint 2: RBAC & Organization Management**
  * Multi-tenant Organizations, Campuses/Branches, and Subscriptions (Pro Plan)
  * System Roles (`SUPER_ADMIN`, `ADMIN`, `TRAINER`, `STUDENT`) & Custom Permissions matrix
  * Granular `@Roles()`, `@Permissions()`, `RolesGuard`, and `PermissionsGuard`
  * Organization management API (`/api/v1/organizations`, `/api/v1/rbac`)
* **Sprint 3: Course Module, Curriculum & Learning Experience**
  * Categories, Courses, Modules, Lessons, Quizzes, Assignments, and Resources
  * Student Enrollments and real-time progress tracking
  * UI matching design specification (`design/edu-sphere-design.png`):
    * **Login Page** (with Google / Microsoft social authentication and hero metrics)
    * **Register Page** (with form validation and Nelson Mandela quote hero)
    * **Forgot Password Page** (with reset workflow and email check confirmation)
    * **Student Dashboard** (with stats row, Continue Learning 60% progress card, Recommended Courses, Donut progress ring, and Upcoming Deadlines)
    * **Course Detail & Curriculum** (interactive module accordions, expandable lessons, completion checkboxes)
    * **Student Profile Page** (avatar editor, student badge, tabs, and personal information update)
    * **Notifications Dropdown** (interactive header bell with unread count and mark all as read)
    * **Certificates Page** (credential badges and certificate PDF downloads)
    * **Messages Page** (contact threads and interactive chat conversation stream)
    * **Calendar Page** (April 2025 monthly grid with color-coded event tags)
    * **Organization Management Portal** (campuses, team directory, and RBAC matrix)

---

## 🚀 Quick Start with Docker (Recommended)

To build and run the entire stack with Docker Compose:

```bash
docker compose up --build -d
```

To stop all services:
```bash
docker compose down
```

### URLs & Ports:
* **Web Application**: [http://localhost:4200](http://localhost:4200)
* **API Gateway**: [http://localhost:3000](http://localhost:3000)
* **Interactive OpenAPI / Swagger**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
* **PostgreSQL**: `localhost:5433` (db: `edusphere`, user: `edusphere`)
* **Redis**: `localhost:6380`

---

## 💻 Local Development Setup

1. **Prerequisites**:
   * Node.js `20.19+` or `25+`
   * Docker & Docker Compose

2. **Setup environment**:
   ```bash
   cp .env.example .env
   ```

3. **Start Postgres & Redis**:
   ```bash
   docker compose up postgres redis -d
   ```

4. **Install monorepo dependencies**:
   ```bash
   npm install
   ```

5. **Generate Prisma Client & Seed Database**:
   ```bash
   npm run db:generate
   npx prisma db push --schema apps/api/prisma/schema.prisma
   npm run db:seed
   ```

6. **Run Both API and Web in development mode**:
   ```bash
   npm run dev
   ```

---

## 🔑 Default Test Accounts

All test accounts use the password: `Password123!`

| Role | Email | Purpose |
|---|---|---|
| **Student** | `alex@example.com` | Primary learner matching design mockups (Alex Johnson) |
| **Trainer** | `sarah.wilson@edusphere.com` | Lead Web Architect & Instructor |
| **Admin** | `admin@edusphere.com` | Organization Administrator (Elena Rostova) |
| **Super Admin** | `superadmin@edusphere.com` | Platform Administrator |

---

## 🧪 Running Tests

To run the full backend unit test suite (23 tests covering Auth, Organizations, Courses, Enrollments, and Portal):

```bash
npm test
```

---

## 📁 Repository Structure

```text
edu-sphere/
├── apps/
│   ├── api/                     # NestJS Backend API
│   │   ├── prisma/              # Prisma schema, migrations, and seed script
│   │   └── src/
│   │       ├── auth/            # JWT, Auth Controller/Service, Guards & Decorators
│   │       ├── organizations/   # Organizations, Branches, Subscriptions & Members
│   │       ├── roles-permissions/# RBAC matrix and permissions enforcement
│   │       ├── courses/         # Courses, Categories, Modules & Lessons
│   │       ├── enrollments/     # Student enrollments and lesson progress
│   │       ├── portal/          # Dashboard, notifications, messages, certificates
│   │       └── shared/          # Middleware, request logging & correlation IDs
│   └── web/                     # Angular 20 Standalone SPA
│       └── src/app/
│           ├── core/            # Singleton auth and portal data services
│           ├── shared/ui/       # Brand, Avatar, Button, Card, Toast, Breadcrumbs
│           ├── layout/          # Responsive Main Layout with sidebar & header
│           └── features/        # Auth, Dashboard, Courses, Profile, Certificates, etc.
├── docs/                        # Architecture diagrams and API reference
├── design/                      # Design mockups (edu-sphere-design.png)
└── docker-compose.yml           # Multi-container orchestration
```
