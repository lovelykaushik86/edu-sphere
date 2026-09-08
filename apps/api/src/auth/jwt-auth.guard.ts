import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable() export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext) { const req = context.switchToHttp().getRequest(); const token = req.headers.authorization?.replace(/^Bearer\s+/i, ''); if (!token) throw new UnauthorizedException('Access token is required'); try { req.user = await this.jwt.verifyAsync(token, { secret: process.env.JWT_ACCESS_SECRET }); return true; } catch { throw new UnauthorizedException('Invalid or expired access token'); } }
}
