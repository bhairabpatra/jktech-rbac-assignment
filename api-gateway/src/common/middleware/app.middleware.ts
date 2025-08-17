// src/common/middleware/app.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = uuidv4();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);

    const now = new Date().toISOString();
    console.log(
      `[${now}] ${req.method} ${req.originalUrl} | Request-ID: ${requestId}`,
    );

    next(); // pass to next middleware or controller
  }
}
