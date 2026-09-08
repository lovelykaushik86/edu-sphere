# Authentication API

Base URL: `/api/v1`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Creates an unverified student account |
| POST | `/auth/login` | Returns access and refresh tokens |
| POST | `/auth/refresh` | Rotates a refresh token |
| POST | `/auth/logout` | Revokes the current refresh token |
| POST | `/auth/forgot-password` | Sends/reset link (returns URL in development) |
| POST | `/auth/reset-password` | Changes password with reset token |
| GET | `/auth/verify-email?token=` | Verifies email |
| GET | `/auth/me` | Authenticated user profile |
| GET | `/auth/login-history` | Authenticated login history |

Send `Authorization: Bearer <accessToken>` to protected endpoints. API errors use `{ statusCode, message, error }`.
