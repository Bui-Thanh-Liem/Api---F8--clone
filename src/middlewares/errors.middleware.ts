import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';

// ExceptionFilter -> way display error object
// HttpException (able custom) -> [ForbiddenException] (built-in)
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // Information about the exception
  // where the exception occurred
  // ArgumentsHost -> excutionContext -> req, res
  catch(exception: HttpException, host: ArgumentsHost) {
    //
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const resError = exception.getResponse();

    //
    res.status(statusCode).json({
      statusCode: statusCode || 500,
      error: resError['error'],
      message: resError['message'],
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
