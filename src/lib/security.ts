/**
 * Professional Security & Sanitization Utilities
 * Input sanitization and security helpers
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize SQL/NoSQL injection attempts
 */
export function sanitizeQuery(input: string): string {
  if (!input) return '';

  // Remove common injection patterns
  return input
    .replace(/[${}]/g, '')
    .replace(/\\/g, '')
    .replace(/;/g, '')
    .trim();
}

/**
 * Sanitize File Paths
 */
export function sanitizeFilePath(path: string): string {
  if (!path) return '';

  // Remove directory traversal attempts
  return path
    .replace(/\.\./g, '')
    .replace(/[<>:"|?*]/g, '')
    .trim();
}

/**
 * Normalize Email Address
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';
  return email.toLowerCase().trim();
}

/**
 * Normalize Phone Number (Pakistan Format)
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format: +92XXXXXXXXXX
  if (digits.startsWith('0')) {
    return '+92' + digits.substring(1);
  }
  if (digits.startsWith('92')) {
    return '+' + digits;
  }
  return '+92' + digits;
}

/**
 * Mask Sensitive Data
 */
export function maskEmail(email: string): string {
  if (!email) return '';

  const [name, domain] = email.split('@');
  if (!domain) return email;

  const maskedName = name.substring(0, 2) + '***' + name.substring(name.length - 1);
  return `${maskedName}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '***';

  return '***' + digits.substring(digits.length - 4);
}

export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber) return '';

  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 4) return '****';

  return '**** **** **** ' + digits.substring(digits.length - 4);
}

/**
 * Rate Limiting Helper
 */
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    // New window
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  // Existing window
  record.count++;

  const allowed = record.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - record.count);
  const resetIn = record.resetTime - now;

  return { allowed, remaining, resetIn };
}

/**
 * Generate Random Token
 */
export function generateRandomToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return token;
}

/**
 * Generate Secure Random Password
 */
export function generateSecurePassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercase + uppercase + numbers + symbols;

  let password = '';

  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill remaining length
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

/**
 * Validate Strong Password
 */
export function isStrongPassword(password: string): {
  isStrong: boolean;
  feedback: string[];
} {
  const feedback: string[] = [];

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    feedback.push('Password must contain at least one special character');
  }

  return {
    isStrong: feedback.length === 0,
    feedback,
  };
}

/**
 * Prevent Parameter Pollution
 */
export function sanitizeQueryParams(params: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    // Take only the first value if array
    if (Array.isArray(value)) {
      sanitized[key] = value[0];
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
