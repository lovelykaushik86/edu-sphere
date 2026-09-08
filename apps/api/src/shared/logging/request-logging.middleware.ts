import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.header('x-request-id') ?? randomUUID();
    const correlationId = req.header('x-correlation-id') ?? requestId;
    const startedAt = Date.now();
    res.setHeader('x-request-id', requestId);
    res.setHeader('x-correlation-id', correlationId);
    res.on('finish', () => this.logger.log(JSON.stringify({ requestId, correlationId, method: req.method, path: req.originalUrl, statusCode: res.statusCode, durationMs: Date.now() - startedAt })));
    next();
  }
}
