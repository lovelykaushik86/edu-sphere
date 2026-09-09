# EduSphere LMS — Technical Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│               Angular 20 Standalone SPA                     │
│    (Signals, Feature-First Layout, Responsive Navigation)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON (JWT Bearer)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    NestJS API Gateway                       │
│    (Versioning v1, Swagger OpenAPI, Helmet, Request Logger)  │
└──────┬──────────────┬───────────────┬───────────────┬───────┘
       │              │               │               │
       ▼              ▼               ▼               ▼
┌────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
│    Auth    │ │Organizations│ │   Courses   │ │ Enrollments  │
│  & RBAC    │ │  & Branches │ │ & Curriculum│ │  & Progress  │
└──────┬─────┘ └──────┬──────┘ └──────┬──────┘ └──────┬───────┘
       │              │               │               │
       └──────────────┴───────┬───────┴───────────────┘
                              ▼
                 ┌───────────────────────────┐
                 │        Prisma ORM         │
                 └────────────┬──────────────┘
                              ▼
                 ┌───────────────────────────┐
                 │   PostgreSQL 16 Database  │
                 └───────────────────────────┘
```

---

## 1. Domain Modules (Sprint 0 - 3)

### Module 1: Authentication & Identity
* Access tokens (15-min expiration) signed with `JWT_ACCESS_SECRET`.
* Rotating refresh tokens (7-day expiration) stored as SHA-256 hashes in PostgreSQL.
* Token revocation on logout.
* Auditing: Every login, registration, password reset, and refresh token rotation produces an immutable `AuditLog` entry.

### Module 2: Organization Management & Multi-Tenancy (Sprint 2)
* **Organization**: Represents the top-level training institution (e.g. EduSphere Global Academy) with domain, contact details, and subscription.
* **Branches**: Physical or virtual campuses (e.g. Sydney Central Campus, New York Campus) linked to organizations.
* **Subscriptions**: Quota management for users, courses, and storage tiering (`FREE`, `STARTER`, `PRO`, `ENTERPRISE`).
* **RBAC**:
  * System roles: `SUPER_ADMIN`, `ADMIN`, `TRAINER`, `STUDENT`.
  * Permissions matrix with code strings (`org:read`, `org:update`, `course:create`, `student:enroll`, etc.).
  * Role and permission guards (`@Roles()`, `@Permissions()`, `RolesGuard`, `PermissionsGuard`).

### Module 3: Course Management & Student Progress (Sprint 3)
* **Course Catalog**: Categorized courses with difficulty levels (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`), ratings, duration, badges, and featured flags.
* **Curriculum Hierarchy**: `Course` ➔ `Module` (sections with duration) ➔ `Lesson` (`VIDEO`, `TEXT`, `QUIZ`, `ASSIGNMENT`).
* **Student Enrollments**: Links student to course, tracking current lesson and overall completion percentage.
* **Lesson Progress**: Granular lesson completion tracking with automatic course completion recalculation.
* **Portal Aggregation**: Unified dashboard API endpoint aggregating student stats (Enrolled: 5, In Progress: 3, Completed: 2, Certificates: 1), continue learning course, donut chart progress, and upcoming deadlines.

---

## 2. Frontend Structure (Angular 20)

`apps/web/src/app` follows a feature-first architecture:
* `core/`: Singleton services (`AuthService`, `PortalDataService`) and HTTP interceptors.
* `shared/ui/`: Reusable primitives (`BrandComponent`, `EduAvatarComponent`, `EduButtonComponent`, `EduCardComponent`, `EduBreadcrumbComponent`, `ToastComponent`).
* `layout/`: `MainLayoutComponent` with responsive sidebar, notifications dropdown, and user menu.
* `features/`:
  * `auth/`: Login, Register, Forgot Password, Reset Password, Verify Email.
  * `dashboard/`: Student Dashboard with progress charts and deadlines.
  * `courses/`: Course Catalog and Course Detail with expandable curriculum.
  * `profile/`: Student profile view and personal information editor.
  * `certificates/`: Credential badges and PDF download triggers.
  * `messages/`: Contact threads and chat view.
  * `calendar/`: Monthly calendar grid with color-coded event pills.
  * `organization/`: Organization details, campus branches, and RBAC matrix.
