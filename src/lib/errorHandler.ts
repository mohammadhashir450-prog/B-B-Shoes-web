/**
 * Professional Error Handler Middleware
 * Centralized error handling for consistent error responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from './apiResponse';

/**
 * MongoDB Error Types
 */
interface MongoError extends Error {
  code?: number;
  keyPattern?: any;
  keyValue?: any;
}

/**
 * Async Handler Wrapper
 * Wraps API routes to catch errors automatically
 */
export function asyncHandler(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      return handleError(error);
    }
  };
}

/**
 * Handle Different Error Types
 */
export function handleError(error: any): NextResponse {
  console.error('❌ API Error:', error);

  // MongoDB Duplicate Key Error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    const value = error.keyValue?.[field];
    return errorResponse(
      `${field} '${value}' already exists`,
      409
    );
  }

  // MongoDB Validation Error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors || {}).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
    return errorResponse('Validation failed', 400, errors);
  }

  // MongoDB Cast Error (Invalid ObjectId)
  if (error.name === 'CastError') {
    return errorResponse(`Invalid ${error.path}: ${error.value}`, 400);
  }

  // JWT Errors
  if (error.name === 'JsonWebTokenError') {
    return errorResponse('Invalid token', 401);
  }

  if (error.name === 'TokenExpiredError') {
    return errorResponse('Token expired', 401);
  }

  // Custom Error with Status Code
  if (error.statusCode) {
    return errorResponse(error.message, error.statusCode);
  }

  // Default Server Error
  return errorResponse(
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message,
    500
  );
}

/**
 * Custom Error Class
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Validation Error
 */
export class ValidationError extends ApiError {
  errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message, 400);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Unauthorized Error
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden Error
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}
