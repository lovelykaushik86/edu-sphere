# Architecture

```text
Angular 20 SPA ──REST/JWT──> NestJS API ──Prisma──> PostgreSQL
        │                         │
        └── CloudFront/S3          ├── Redis (sessions, rate limits, jobs)
                                  └── BullMQ → SES / notifications
```

The monorepo uses npm workspaces. `apps/web` is a standalone Angular application. `apps/api` owns the REST API and Prisma schema. Docker Compose supplies development PostgreSQL and Redis; AWS ECS, RDS, ElastiCache, S3, CloudFront, SES and CloudWatch are the production targets.

Security: passwords are bcrypt-hashed; access JWTs are short-lived; refresh JWTs are rotated and persisted as SHA-256 hashes; reset and verification tokens are one-use, time-limited hashes. Audit events retain authentication activity and login history stores IP/user-agent metadata.
