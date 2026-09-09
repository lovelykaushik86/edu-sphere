# EduSphere LMS API Reference

Base URL: `/api/v1`  
Interactive OpenAPI / Swagger Documentation: `http://localhost:3000/api/docs`

Send `Authorization: Bearer <accessToken>` to protected endpoints.

---

## 1. Authentication (`/api/v1/auth`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register student account |
| POST | `/auth/login` | Authenticate with email/password; returns access & refresh tokens |
| POST | `/auth/refresh` | Rotate refresh token |
| POST | `/auth/logout` | Revoke active refresh token |
| POST | `/auth/forgot-password` | Request password reset link |
| POST | `/auth/reset-password` | Reset password using token |
| GET | `/auth/verify-email?token=` | Verify user email address |
| GET | `/auth/me` | Retrieve profile of authenticated user |
| GET | `/auth/login-history` | View recent login activity and user-agent metadata |

---

## 2. Organization Management (`/api/v1/organizations`) — Sprint 2

| Method | Endpoint | Description |
|---|---|---|
| GET | `/organizations` | List all organizations |
| GET | `/organizations/:idOrSlug` | Retrieve organization details, branches, and members |
| POST | `/organizations` | Create new organization (Admin / Super Admin) |
| PATCH | `/organizations/:id` | Update organization details |
| GET | `/organizations/:id/branches` | List branches for organization |
| POST | `/organizations/:id/branches` | Create campus branch |
| GET | `/organizations/:id/subscription` | Get organization subscription details |
| PATCH | `/organizations/:id/subscription` | Upgrade or modify subscription plan/limits |
| GET | `/organizations/:id/members` | List organization team members and assigned branches |
| POST | `/organizations/:id/members` | Add user to organization |

---

## 3. Roles & Permissions (`/api/v1/rbac`) — Sprint 2

| Method | Endpoint | Description |
|---|---|---|
| GET | `/rbac/permissions` | List all system permissions |
| GET | `/rbac/roles/:role/permissions` | Get permissions granted to role |
| POST | `/rbac/roles/:role/permissions/:permissionId` | Assign permission to role |
| DELETE | `/rbac/roles/:role/permissions/:permissionId` | Remove permission from role |
| GET | `/rbac/my-permissions` | Get effective permissions for logged-in user |

---

## 4. Courses & Curriculum (`/api/v1/courses`) — Sprint 3

| Method | Endpoint | Description |
|---|---|---|
| GET | `/courses/categories` | List course categories |
| POST | `/courses/categories` | Create course category |
| GET | `/courses` | Search & list courses (query: `category`, `level`, `search`, `featured`) |
| GET | `/courses/:idOrSlug` | Retrieve course details with modules and lessons |
| POST | `/courses` | Create new course (Trainer / Admin) |
| PATCH | `/courses/:id` | Update course metadata |
| POST | `/courses/:id/modules` | Add module section to course |
| POST | `/courses/modules/:moduleId/lessons` | Add video/text/quiz lesson to module |

---

## 5. Enrollments & Progress (`/api/v1/enrollments`) — Sprint 3

| Method | Endpoint | Description |
|---|---|---|
| GET | `/enrollments/my-courses` | List enrolled courses for current student |
| POST | `/enrollments/:courseId` | Enroll in course |
| GET | `/enrollments/:courseId/progress` | Get course progress and completed lessons |
| POST | `/enrollments/:courseId/lessons/:lessonId/progress` | Mark lesson completed / update timestamp |

---

## 6. Student Portal Aggregation (`/api/v1/portal`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/portal/dashboard` | Dashboard metrics (stats, continue learning, recommended, donut progress, deadlines) |
| GET | `/portal/notifications` | Get notifications and unread badge count |
| POST | `/portal/notifications/:id/read` | Mark notification as read |
| POST | `/portal/notifications/read-all` | Mark all notifications read |
| GET | `/portal/certificates` | Get earned certificates and credential numbers |
| GET | `/portal/messages` | Get active chat conversations |
| POST | `/portal/messages` | Send chat message |
| GET | `/portal/calendar` | Get monthly schedule events |
| PATCH | `/portal/profile` | Update student profile information |
