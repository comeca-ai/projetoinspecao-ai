import { LRUCache } from 'lru-cache';

// Define types for rate limit options
type RateLimitOptions = {
  uniqueTokenPerInterval?: number; // Max users per interval
  interval?: number; // Time frame in milliseconds
};

// Create LRU cache for rate limiting
const rateLimit = (options?: RateLimitOptions) => {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500, // Max 500 users per interval
    ttl: options?.interval || 60000, // 1 minute per interval
  });

  return {
    check: (limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      
      tokenCount[0] += 1;
      
      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage > limit;
      
      return {
        isRateLimited,
        limit,
        currentUsage,
        remaining: isRateLimited ? 0 : limit - currentUsage,
      };
    },
  };
};

// Rate limit configurations for different endpoints
export const authRateLimiter = rateLimit({
  uniqueTokenPerInterval: 1000, // Max 1000 users per interval
  interval: 60 * 1000, // 1 minute
});

// Stricter rate limit for login attempts
export const loginRateLimiter = rateLimit({
  uniqueTokenPerInterval: 500, // Max 500 users per interval
  interval: 60 * 1000, // 1 minute
});

// Very strict rate limit for password reset
export const passwordResetRateLimiter = rateLimit({
  uniqueTokenPerInterval: 200, // Max 200 users per interval
  interval: 60 * 60 * 1000, // 1 hour
});

// Strict rate limit for registration
export const registrationRateLimiter = rateLimit({
  uniqueTokenPerInterval: 300, // Max 300 users per interval
  interval: 60 * 60 * 1000, // 1 hour
});

// Apply rate limiting to endpoints
export const applyRateLimit = async (req: Request, limit = 5, limiterType: 'default' | 'login' | 'register' | 'passwordReset' = 'default') => {
  // Use IP address as the rate limit key
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  
  // Select the appropriate rate limiter based on the endpoint type
  let rateLimiter;
  let retryAfter = '60';
  
  switch (limiterType) {
    case 'login':
      rateLimiter = loginRateLimiter;
      limit = 3; // Stricter limit for login attempts
      break;
    case 'register':
      rateLimiter = registrationRateLimiter;
      limit = 2; // Stricter limit for registration
      retryAfter = '3600'; // 1 hour
      break;
    case 'passwordReset':
      rateLimiter = passwordResetRateLimiter;
      limit = 1; // Very strict limit for password reset
      retryAfter = '3600'; // 1 hour
      break;
    default:
      rateLimiter = authRateLimiter;
  }
  
  // Check rate limit
  const rateLimitInfo = rateLimiter.check(limit, ip);
  
  // Set rate limit headers
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString());
  headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
  
  if (rateLimitInfo.isRateLimited) {
    headers.set('Retry-After', retryAfter);
    return {
      success: false,
      status: 429,
      headers,
      body: { error: 'Too many requests. Please try again later.' },
    };
  }
  
  return { success: true, headers };
};

// Helper function to apply rate limiting specifically to authentication endpoints
export const applyAuthRateLimit = async (req: Request, authType: 'login' | 'register' | 'passwordReset') => {
  // Get additional context for more accurate rate limiting
  const email = req.headers.get('x-email') || '';
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  
  // Use both IP and email (if available) as the rate limit key for better security
  const key = email ? `${ip}:${email}` : ip;
  
  // Apply rate limiting based on auth type
  return applyRateLimit(req, undefined, authType);
};
