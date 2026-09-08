# Architecture

```text
Angular 20 SPA ──REST/JWT──> NestJS API ──Prisma──> PostgreSQL
        │                         │
        └── CloudFront/S3          ├── Redis (sessions, rate limits, jobs)
                                  └── BullMQ → SES / notifications
```

The monorepo uses npm workspaces. The Angular application is organized into `core` (singleton infrastructure), `shared/ui` (reusable UI primitives), `layout` (application shell), and independently deployable `features`. The Nest application is organized by domain with `shared` cross-cutting services. Docker Compose supplies development PostgreSQL and Redis; AWS ECS, RDS, ElastiCache, S3, CloudFront, SES and CloudWatch are the production targets.

Security: passwords are bcrypt-hashed; access JWTs are short-lived; refresh JWTs are rotated and persisted as SHA-256 hashes; reset and verification tokens are one-use, time-limited hashes. Audit events retain authentication activity and login history stores IP/user-agent metadata. Every HTTP response includes request and correlation IDs; structured JSON request logs make logs searchable in CloudWatch or another central log system.
