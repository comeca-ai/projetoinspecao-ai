import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applyRateLimit } from '@/utils/rateLimit';
import { csrfProtection } from '@/utils/csrf';
import { validateInput } from '@/utils/validation';
import { logger } from '@/utils/logger';
import { 
  ApiError,
  ForbiddenError,
  UnauthorizedError,
  RateLimitError,
  errorHandler,
  withErrorHandler 
} from '@/utils/errorHandler';

// Security headers configuration
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.supabase.co;",
};

// Apply security headers to all responses
export async function securityHeadersMiddleware(
  request: NextRequest
) {
  const response = NextResponse.next();

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add HSTS header for HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

// API security middleware
export const apiSecurityMiddleware = withErrorHandler(async (
  request: NextRequest,
  options: {
    rateLimit?: number;
    requireCsrf?: boolean;
    requireAuth?: boolean;
    validateBody?: any; // Zod schema for request body validation
    allowedRoles?: string[];
  } = {}
) => {
  const { 
    rateLimit = 10, 
    requireCsrf = true, 
    requireAuth = true,
    validateBody, 
    allowedRoles = [] 
  } = options;
  
  // Get user ID from request headers (set by auth middleware if authenticated)
  const userId = request.headers.get('x-user-id');
  
  // Log request
  await logger.info(
    `API Request: ${request.method} ${request.url}`,
    {
      method: request.method,
      url: request.url,
      userId: userId || 'anonymous',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    }
  );

  // Apply rate limiting
  const rateLimitResult = await applyRateLimit(request, rateLimit);
  if (!rateLimitResult.success) {
    await logger.warn('Rate limit exceeded', { userId, ip: request.headers.get('x-forwarded-for') });
    throw new RateLimitError('Too many requests. Please try again later.');
  }

  // Require authentication
  if (requireAuth && !userId) {
    await logger.warn('Unauthorized access attempt', { 
      path: request.url,
      method: request.method,
      ip: request.headers.get('x-forwarded-for') 
    });
    throw new UnauthorizedError('Authentication required');
  }

  // Check user roles if required
  if (requireAuth && allowedRoles.length > 0) {
    const userRole = request.headers.get('x-user-role');
    if (!userRole || !allowedRoles.includes(userRole)) {
      await logger.warn('Forbidden: Insufficient permissions', { 
        userId, 
        userRole,
        requiredRoles: allowedRoles,
        path: request.url 
      });
      throw new ForbiddenError('Insufficient permissions');
    }
  }

  // CSRF protection for state-changing requests
  if (requireCsrf && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const csrfResult = csrfProtection(
      request,
      process.env.CSRF_SECRET || 'your-secret-key'
    );

    if (!csrfResult.isValid) {
      await logger.warn('Invalid CSRF token', { 
        userId,
        ip: request.headers.get('x-forwarded-for') 
      });
      throw new ForbiddenError(csrfResult.error || 'Invalid CSRF token');
    }
  }

  // Request body validation
  if (validateBody && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    try {
      const body = await request.json();
      const validation = await validateInput(body, validateBody);
      
      if (!validation.success) {
        await logger.warn('Request validation failed', { 
          userId,
          errors: validation.errors 
        });
        throw new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', {
          errors: validation.errors
        });
      }
      
      // Replace request body with validated data
      request.body = JSON.stringify(validation.data);
    } catch (error) {
      if (!(error instanceof ApiError)) {
        throw new ApiError(400, 'Invalid request body', 'INVALID_REQUEST_BODY');
      }
      throw error;
    }
  }

  // Add security headers to response
  const response = NextResponse.next();
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Log successful request processing
  response.headers.set('X-Request-ID', crypto.randomUUID());
  
  return response;
});

// Authentication middleware
export const authMiddleware = withErrorHandler(async (request: NextRequest) => {
  const token = request.headers.get('authorization')?.split(' ')[1];
  
  if (!token) {
    await logger.warn('Authentication attempt without token', {
      path: request.url,
      method: request.method,
      ip: request.headers.get('x-forwarded-for')
    });
    throw new UnauthorizedError('Authentication required');
  }

  try {
    // Verify the JWT token using Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      await logger.warn('Invalid authentication token', {
        error: error?.message,
        ip: request.headers.get('x-forwarded-for')
      });
      throw new UnauthorizedError('Invalid or expired token');
    }
    
    // Get additional user data if needed
    const userRole = user.user_metadata?.role || 'user';
    
    // Log successful authentication
    await logger.info('User authenticated', {
      userId: user.id,
      email: user.email,
      role: userRole,
      ip: request.headers.get('x-forwarded-for')
    });
    
    // Add user info to request headers for API routes to use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-email', user.email || '');
    requestHeaders.set('x-user-role', userRole);
    
    // Create response with updated headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error) {
    await logger.error('Authentication error', error as Error, undefined, request);
    throw error;
  }
});
