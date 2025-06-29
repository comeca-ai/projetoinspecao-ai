import { format } from 'date-fns';
import { appendFile, mkdir, access, constants, readdir, unlink, stat } from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { createHash } from 'crypto';

// Log levels
type LogLevel = 'info' | 'warn' | 'error' | 'security';

// Error info type
type ErrorInfo = {
  name: string;
  message: string;
  stack?: string;
};

// Log entry type
type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  error?: ErrorInfo;
  userId?: string;
  ip?: string;
  userAgent?: string;
  request?: {
    method: string;
    url: string;
    ip: string;
  };
};

class Logger {
  private logDir: string;
  private logFile: string;
  private maxFileSize: number; // in bytes
  private maxFiles: number;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, 'security.log');
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.maxFiles = 30; // Keep 30 days of logs
    this.ensureLogDirectory();
  }

  private async ensureLogDirectory() {
    try {
      await access(this.logDir, constants.F_OK);
    } catch {
      await mkdir(this.logDir, { recursive: true });
    }
  }

  private getCurrentLogFile(): string {
    const date = format(new Date(), 'yyyy-MM-dd');
    return path.join(this.logDir, `security-${date}.log`);
  }

  // Rotate logs
  private async rotateLogs() {
    try {
      const files = await readdir(this.logDir);
      const logFiles = files
        .filter((file: string) => file.startsWith('security-') && file.endsWith('.log'))
        .sort()
        .reverse();

      // Remove oldest logs if we have more than maxFiles
      if (logFiles.length > this.maxFiles) {
        const filesToDelete = logFiles.slice(this.maxFiles);
        await Promise.all(
          filesToDelete.map((file: string) => 
            unlink(path.join(this.logDir, file))
          )
        );
      }
    } catch (error) {
      console.error('Error rotating logs:', error);
    }
  }

  private async writeToLog(entry: LogEntry) {
    try {
      const logEntry = JSON.stringify({
        ...entry,
        timestamp: format(new Date(entry.timestamp), 'yyyy-MM-dd HH:mm:ss.SSS')
      }) + '\n';

      const logFilePath = this.getCurrentLogFile();
      await appendFile(logFilePath, logEntry, 'utf8');
      
      // Rotate logs if current file is too large
      try {
        const stats = await stat(logFilePath);
        if (stats.size > this.maxFileSize) {
          await this.rotateLogs();
        }
      } catch (error) {
        console.error('Error checking log file size:', error);
      }
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  // Log security-related events
  public async security(
    message: string, 
    data: Record<string, unknown> = {},
    userId?: string,
    request?: Request
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'security',
      message,
      data,
      userId,
      ip: request?.headers.get('x-forwarded-for') || request?.headers.get('cf-connecting-ip') || 'unknown',
      userAgent: request?.headers.get('user-agent')
    };

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SECURITY] ${message}`, data || '');
    }

    await this.writeToLog(entry);
  }

  // Log errors
  public async error(
    message: string, 
    error: unknown = new Error('Unknown error'),
    userId?: string,
    request?: Request
  ) {
    // Ensure we have an Error object
    const errorObj = error instanceof Error 
      ? error 
      : new Error(String(error));
      
    // Extract error properties safely
    const errorInfo: ErrorInfo = {
      name: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack
    };
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error: errorInfo,
      userId,
      ...(request && {
        request: {
          method: request.method,
          url: request.url,
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        }
      })
    };

    console.error(`[ERROR] ${message}`, error || '');
    await this.writeToLog(entry);
  }

  // Log warnings
  public async warn(
    message: string, 
    data: Record<string, unknown> = {},
    userId?: string
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      data,
      userId
    };

    console.warn(`[WARN] ${message}`, data || '');
    await this.writeToLog(entry);
  }

  // Log informational messages
  public async info(
    message: string, 
    data: Record<string, unknown> = {},
    userId?: string
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      data,
      userId
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`, data || '');
    }
    
    await this.writeToLog(entry);
  }
}

// Create a singleton instance
export const logger = new Logger();

// Request logging middleware
export async function logRequest(
  request: Request,
  response: Response,
  userId?: string
) {
  const url = new URL(request.url);
  const logData = {
    method: request.method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
    status: response.status,
    statusText: response.statusText,
    contentType: response.headers.get('content-type'),
    contentLength: response.headers.get('content-length') || '0',
  };

  if (response.status >= 500) {
    await logger.error(
      `${request.method} ${url.pathname} - ${response.status} ${response.statusText}`,
      undefined,
      userId,
      request
    );
  } else if (response.status >= 400) {
    await logger.warn(
      `${request.method} ${url.pathname} - ${response.status} ${response.statusText}`,
      logData,
      userId
    );
  } else {
    await logger.info(
      `${request.method} ${url.pathname} - ${response.status}`,
      logData,
      userId
    );
  }
}
