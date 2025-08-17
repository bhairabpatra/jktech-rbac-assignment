/* eslint-disable prettier/prettier */
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) // catches all HttpExceptions (403, 404, etc.)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message || 'Unexpected error';

    response.status(status).json({
      success: false,
      statusCode: status,
      error: exceptionResponse.error || 'error',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
