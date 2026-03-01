/**
 * Professional API Response Helper
 * Consistent response structure across all API endpoints
 */

import { NextResponse } from 'next/server';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
  timestamp?: string;
}

/**
 * Success Response
 */
export function successResponse<T>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Error Response
 */
export function errorResponse(
  message: string = 'An error occurred',
  statusCode: number = 500,
  errors?: any[]
): NextResponse {
  const response: ApiResponse = {
    success: false,
    message,
    error: message,
    errors,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Validation Error Response
 */
export function validationErrorResponse(
  errors: any[],
  message: string = 'Validation failed'
): NextResponse {
  return errorResponse(message, 400, errors);
}

/**
 * Not Found Response
 */
export function notFoundResponse(
  resource: string = 'Resource'
): NextResponse {
  return errorResponse(`${resource} not found`, 404);
}

/**
 * Unauthorized Response
 */
export function unauthorizedResponse(
  message: string = 'Unauthorized access'
): NextResponse {
  return errorResponse(message, 401);
}

/**
 * Forbidden Response
 */
export function forbiddenResponse(
  message: string = 'Access forbidden'
): NextResponse {
  return errorResponse(message, 403);
}

/**
 * Created Response
 */
export function createdResponse<T>(
  data: T,
  message: string = 'Resource created successfully'
): NextResponse {
  return successResponse(data, message, 201);
}
