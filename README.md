# EduSphere LMS — Sprint 0 & 1

Cloud-native LMS foundation with an Angular 20 frontend and NestJS + Prisma API.

`apps/web/src/app` follows a feature-first structure: `core`, `shared/ui`, `layout`, and `features`. New product areas should be added beneath `features`, rather than at the application root.

## Quick start

1. Install Node 20.19+.
2. Copy `.env.example` to `.env` and replace the JWT secrets.
3. `docker compose up -d`
4. `npm install`
5. `npm run db:generate && npm run db:migrate`
6. `npm run dev`

Open `http://localhost:4200`; API health is at `http://localhost:3000/api/v1/health`. Development PostgreSQL and Redis are exposed on host ports `5433` and `6380` by default, avoiding common local-service conflicts.

## Sprint 1 flow

Register → receive a development verification URL in the API response/log → verify → sign in → dashboard. Refresh token rotation, logout/revocation, password reset, audit events, login history, and role guards are implemented in the API.

Swagger is available at `http://localhost:3000/api/docs`. Environment templates are in `env/`; copy the appropriate template into a local `.env` file and keep production values in a secret manager.

See [architecture](docs/architecture.md) and [API reference](docs/api.md).
