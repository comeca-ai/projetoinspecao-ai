import { ZodError } from 'zod';
import { logger } from './logger';
import { AuthorizationError } from './serverAuth';
import { supabase } from '@/lib/supabase';

// Define custom request type with user property
interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Type for API handler function
type ApiHandler<T = any> = (
  req: CustomRequest,
  ...args: any[]
) => Promise<Response | T>;

type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
};

// Base error class
export class BaseError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string = 'INTERNAL_SERVER_ERROR',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Custom error class for API errors
export class ApiError extends BaseError {
  constructor(
    statusCode: number,
    message: string,
    code: string = 'INTERNAL_SERVER_ERROR',
    details?: unknown
  ) {
    super(statusCode, message, code, details);
  }
}

// 400 Bad Request
export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request', details?: unknown) {
    super(400, message, 'BAD_REQUEST', details);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

// 403 Forbidden
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

// 404 Not Found
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
  }
}

// 409 Conflict
export class ConflictError extends ApiError {
  constructor(message: string = 'Conflict', details?: unknown) {
    super(409, message, 'CONFLICT', details);
  }
}

// 422 Unprocessable Entity
export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', details?: unknown) {
    super(422, message, 'VALIDATION_ERROR', details);
  }
}

// 429 Too Many Requests
export class RateLimitError extends ApiError {
  constructor(message: string = 'Too many requests') {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
  }
}

// 500 Internal Server Error
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
  }
}

// Format error response
export const formatError = (error: unknown, req: CustomRequest): ErrorResponse => {
  // Log the error for debugging
  logger.error('Error occurred:', { error, url: req.url, method: req.method, userId: req.user?.id });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(err.message);
    });

    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { errors: formattedErrors },
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Handle authorization errors from serverAuth.ts
  if (error instanceof AuthorizationError) {
    return {
      success: false,
      error: {
        code: error.statusCode === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN',
        message: error.message,
        details: { attemptedAccess: req.url },
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Handle custom API errors
  if (error instanceof BaseError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Handle generic errors
  const err = error as Error;
  return {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message || 'An unexpected error occurred',
    },
    timestamp: new Date().toISOString(),
  };
}

// Global error handler middleware
export const withErrorHandler = <T = any>(
  handler: ApiHandler<T>
): ApiHandler<T> => {
  return async (req: CustomRequest, ...args: any[]) => {
    try {
      const response = await handler(req, ...args);
      return response;
    } catch (error) {
      const errorResponse = formatError(error, req);
      
      // Determine status code based on error type
      let statusCode = 500;
      if (error instanceof BaseError) {
        statusCode = error.statusCode;
      } else if (error instanceof AuthorizationError) {
        statusCode = error.statusCode;
      }

      // Add security headers to error responses
      const headers = {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Cache-Control': 'no-store'
      };

      return new Response(JSON.stringify(errorResponse), {
        status: statusCode,
        headers,
      });
    }
  };
};

// 404 handler
export function notFoundHandler() {
  const errorResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
    },
    timestamp: new Date().toISOString(),
  };

  // Add security headers to 404 responses
  return new Response(JSON.stringify(errorResponse), {
    status: 404,
    headers: { 
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Cache-Control': 'no-store'
    },
  });
}

// Authentication middleware
export const withAuth = <T = any>(
  handler: ApiHandler<T>,
  requiredRole?: string
): ApiHandler<T> => {
  return withErrorHandler(async (req: CustomRequest, ...args: any[]) => {
    try {
      // Get session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new UnauthorizedError('Authentication required');
      }
      
      // Get user data
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new UnauthorizedError('User not found');
      }
      
      // Get user role from database
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error || !userData) {
        throw new UnauthorizedError('User data not found');
      }
      
      // Check if user has required role
      if (requiredRole && userData.role !== requiredRole && userData.role !== 'admin') {
        throw new ForbiddenError(`Requires ${requiredRole} role`);
      }
      
      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email || '',
        role: userData.role
      };
      
      // Continue to handler
      return handler(req, ...args);
    } catch (error) {
      // Re-throw to be caught by withErrorHandler
      throw error;
    }
  });
};
