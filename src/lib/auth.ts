/**
 * Professional Authentication Middleware
 * Handles user authentication and authorization
 */

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-bbshoes-hashir-2026';

/**
 * JWT Token Payload Interface
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  isAdmin: boolean;
}

/**
 * Generate JWT Token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

/**
 * Verify JWT Token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error: any) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

/**
 * Extract Token from Request Headers
 */
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return null;
  }

  // Check for Bearer token format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Authenticate Request
 * Verifies user is logged in
 */
export function authenticateRequest(req: NextRequest): JWTPayload {
  const token = extractToken(req);

  if (!token) {
    throw new UnauthorizedError('Authentication required');
  }

  return verifyToken(token);
}

/**
 * Authorize Admin Request
 * Verifies user is logged in AND is admin
 */
export function authorizeAdmin(req: NextRequest): JWTPayload {
  const user = authenticateRequest(req);

  if (!user.isAdmin && user.role !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }

  return user;
}

/**
 * Optional Authentication
 * Returns user if authenticated, null if not (doesn't throw error)
 */
export function optionalAuth(req: NextRequest): JWTPayload | null {
  try {
    const token = extractToken(req);
    if (!token) {
      return null;
    }
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

/**
 * Check if User is Admin
 */
export function isAdmin(user: JWTPayload | null): boolean {
  if (!user) return false;
  return user.isAdmin || user.role === 'admin';
}

/**
 * Check if User is Owner or Admin
 */
export function isOwnerOrAdmin(user: JWTPayload | null, resourceUserId: string): boolean {
  if (!user) return false;
  return user.userId === resourceUserId || isAdmin(user);
}
