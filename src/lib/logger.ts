/**
 * Professional Logger Utility
 * Centralized logging for better debugging and monitoring
 */

interface LoggerConfig {
  showTimestamp?: boolean;
  showLevel?: boolean;
  enableColors?: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: LoggerConfig = {}) {
    this.config = {
      showTimestamp: true,
      showLevel: true,
      enableColors: true,
      ...config,
    };
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: string, message: string, data?: any): string {
    let output = '';

    if (this.config.showTimestamp) {
      output += `[${this.getTimestamp()}] `;
    }

    if (this.config.showLevel) {
      output += `[${level}] `;
    }

    output += message;

    if (data) {
      output += ' ' + JSON.stringify(data, null, 2);
    }

    return output;
  }

  /**
   * Info Log
   */
  info(message: string, data?: any): void {
    console.log('ℹ️ ' + this.formatMessage('INFO', message, data));
  }

  /**
   * Success Log
   */
  success(message: string, data?: any): void {
    console.log('✅ ' + this.formatMessage('SUCCESS', message, data));
  }

  /**
   * Warning Log
   */
  warn(message: string, data?: any): void {
    console.warn('⚠️ ' + this.formatMessage('WARN', message, data));
  }

  /**
   * Error Log
   */
  error(message: string, error?: any): void {
    console.error('❌ ' + this.formatMessage('ERROR', message));
    if (error) {
      console.error('Error details:', error);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
  }

  /**
   * Debug Log (only in development)
   */
  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 ' + this.formatMessage('DEBUG', message, data));
    }
  }

  /**
   * Database Log
   */
  db(message: string, data?: any): void {
    console.log('💾 ' + this.formatMessage('DB', message, data));
  }

  /**
   * API Log
   */
  api(method: string, endpoint: string, statusCode?: number): void {
    const message = `${method} ${endpoint}${statusCode ? ` - ${statusCode}` : ''}`;
    console.log('📡 ' + this.formatMessage('API', message));
  }

  /**
   * Auth Log
   */
  auth(message: string, data?: any): void {
    console.log('🔐 ' + this.formatMessage('AUTH', message, data));
  }

  /**
   * Performance Log
   */
  perf(operation: string, duration: number): void {
    console.log(`⚡ ${this.formatMessage('PERF', `${operation} took ${duration}ms`)}`);
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Async Timer Utility
 * Measures execution time of async operations
 */
export async function timeAsync<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    logger.perf(operation, duration);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`${operation} failed after ${duration}ms`, error);
    throw error;
  }
}
