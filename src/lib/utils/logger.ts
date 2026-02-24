/**
 * Unified Logger Utility
 * Provides consistent logging across client and server with support for different levels.
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Default to INFO in production, DEBUG in development
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

class Logger {
  private prefix: string;

  constructor(prefix = 'VizitAfrica') {
    this.prefix = prefix;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.prefix}] [${level}] ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= CURRENT_LOG_LEVEL;
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog('DEBUG')) {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog('INFO')) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog('WARN')) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  error(message: string, ...args: any[]) {
    if (this.shouldLog('ERROR')) {
      console.error(this.formatMessage('ERROR', message), ...args);
    }
  }
}

export const logger = new Logger();

/**
 * Creates a namespaced logger
 */
export function createLogger(namespace: string) {
  return new Logger(namespace);
}
