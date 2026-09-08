# EduSphere LMS — Sprint 0 & 1

Cloud-native LMS foundation with an Angular 20 frontend and NestJS + Prisma API.

## Quick start

1. Install Node 20.19+ (the local shell currently uses Node 16, which cannot run Angular 20).
2. Copy `.env.example` to `.env` and replace the JWT secrets.
3. `docker compose up -d`
4. `npm install`
5. `npm run db:generate && npm run db:migrate`
6. `npm run dev`

Open `http://localhost:4200`; API health is at `http://localhost:3000/api/v1/health`. Development PostgreSQL and Redis are exposed on host ports `5433` and `6380` by default, avoiding common local-service conflicts.

## Sprint 1 flow

Register → receive a development verification URL in the API response/log → verify → sign in → dashboard. Refresh token rotation, logout/revocation, password reset, audit events, login history, and role guards are implemented in the API.

See [architecture](docs/architecture.md) and [API reference](docs/api.md).
