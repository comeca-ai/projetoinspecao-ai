/**
 * Tests for the rateLimit utility
 * 
 * These tests verify that our rate limiting utilities work correctly
 * and properly handle request limiting for different endpoints.
 */

import { 
  createRateLimiter, 
  applyRateLimit,
  applyAuthRateLimit,
  getRateLimitKey
} from '@/utils/rateLimit';
import { LRUCache } from 'lru-cache';

// Mock lru-cache
jest.mock('lru-cache', () => {
  return {
    LRUCache: jest.fn().mockImplementation(() => ({
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn(),
    })),
  };
});

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  }
}));

describe('Rate Limiting Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRateLimiter', () => {
    test('createRateLimiter should create a rate limiter with correct options', () => {
      // Arrange & Act
      const limiter = createRateLimiter({
        max: 100,
        ttl: 60000,
      });
      
      // Assert
      expect(LRUCache).toHaveBeenCalledWith(expect.objectContaining({
        max: 100,
        ttl: 60000,
      }));
      expect(limiter).toBeDefined();
    });
  });

  describe('getRateLimitKey', () => {
    test('getRateLimitKey should generate key from IP address', () => {
      // Arrange
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
        socket: {
          remoteAddress: '10.0.0.1',
        },
      };
      
      // Act
      const key = getRateLimitKey(req as any);
      
      // Assert
      expect(key).toBe('192.168.1.1');
    });

    test('getRateLimitKey should use socket address as fallback', () => {
      // Arrange
      const req = {
        headers: {},
        socket: {
          remoteAddress: '10.0.0.1',
        },
      };
      
      // Act
      const key = getRateLimitKey(req as any);
      
      // Assert
      expect(key).toBe('10.0.0.1');
    });

    test('getRateLimitKey should include email when provided', () => {
      // Arrange
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
        socket: {
          remoteAddress: '10.0.0.1',
        },
        body: {
          email: 'user@example.com',
        },
      };
      
      // Act
      const key = getRateLimitKey(req as any, true);
      
      // Assert
      expect(key).toBe('192.168.1.1:user@example.com');
    });

    test('getRateLimitKey should handle missing email gracefully', () => {
      // Arrange
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
        socket: {
          remoteAddress: '10.0.0.1',
        },
        body: {},
      };
      
      // Act
      const key = getRateLimitKey(req as any, true);
      
      // Assert
      expect(key).toBe('192.168.1.1:unknown');
    });
  });

  describe('applyRateLimit', () => {
    test('applyRateLimit should allow request when under limit', () => {
      // Arrange
      const req = {
        headers: { 'x-forwarded-for': '192.168.1.1' },
        socket: { remoteAddress: '10.0.0.1' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
      };
      const next = jest.fn();
      
      const mockLimiter = {
        get: jest.fn().mockReturnValue({ count: 5, resetTime: Date.now() + 60000 }),
        set: jest.fn(),
        has: jest.fn().mockReturnValue(true),
      };
      
      (LRUCache as jest.Mock).mockImplementation(() => mockLimiter);
      
      // Act
      const middleware = applyRateLimit({ max: 10, ttl: 60000 });
      middleware(req as any, res as any, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 10);
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 5);
    });

    test('applyRateLimit should block request when over limit', () => {
      // Arrange
      const req = {
        headers: { 'x-forwarded-for': '192.168.1.1' },
        socket: { remoteAddress: '10.0.0.1' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
      };
      const next = jest.fn();
      
      const mockLimiter = {
        get: jest.fn().mockReturnValue({ count: 11, resetTime: Date.now() + 60000 }),
        set: jest.fn(),
        has: jest.fn().mockReturnValue(true),
      };
      
      (LRUCache as jest.Mock).mockImplementation(() => mockLimiter);
      
      // Act
      const middleware = applyRateLimit({ max: 10, ttl: 60000 });
      middleware(req as any, res as any, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Too Many Requests',
      }));
    });

    test('applyRateLimit should increment counter for new requests', () => {
      // Arrange
      const req = {
        headers: { 'x-forwarded-for': '192.168.1.1' },
        socket: { remoteAddress: '10.0.0.1' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
      };
      const next = jest.fn();
      
      const mockLimiter = {
        get: jest.fn().mockReturnValue(undefined),
        set: jest.fn(),
        has: jest.fn().mockReturnValue(false),
      };
      
      (LRUCache as jest.Mock).mockImplementation(() => mockLimiter);
      
      // Act
      const middleware = applyRateLimit({ max: 10, ttl: 60000 });
      middleware(req as any, res as any, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(mockLimiter.set).toHaveBeenCalledWith('192.168.1.1', expect.objectContaining({
        count: 1,
      }));
    });
  });

  describe('applyAuthRateLimit', () => {
    test('applyAuthRateLimit should apply stricter limits for login endpoints', () => {
      // Arrange
      const req = {
        headers: { 'x-forwarded-for': '192.168.1.1' },
        socket: { remoteAddress: '10.0.0.1' },
        path: '/api/auth/login',
        body: { email: 'user@example.com' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
      };
      const next = jest.fn();
      
      const mockLimiter = {
        get: jest.fn().mockReturnValue({ count: 2, resetTime: Date.now() + 60000 }),
        set: jest.fn(),
        has: jest.fn().mockReturnValue(true),
      };
      
      (LRUCache as jest.Mock).mockImplementation(() => mockLimiter);
      
      // Act
      const middleware = applyAuthRateLimit();
      middleware(req as any, res as any, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 5); // Login limit
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 3);
    });

    test('applyAuthRateLimit should apply different limits for registration endpoints', () => {
      // Arrange
      const req = {
        headers: { 'x-forwarded-for': '192.168.1.1' },
        socket: { remoteAddress: '10.0.0.1' },
        path: '/api/auth/register',
        body: { email: 'user@example.com' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
      };
      const next = jest.fn();
      
      const mockLimiter = {
        get: jest.fn().mockReturnValue({ count: 1, resetTime: Date.now() + 60000 }),
        set: jest.fn(),
        has: jest.fn().mockReturnValue(true),
      };
      
      (LRUCache as jest.Mock).mockImplementation(() => mockLimiter);
      
      // Act
      const middleware = applyAuthRateLimit();
      middleware(req as any, res as any, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 3); // Registration limit
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 2);
    });

    test('applyAuthRateLimit should apply default limits for other auth endpoints', () => {
      // Arrange
      const req = {
        headers: { 'x-forwarded-for': '192.168.1.1' },
        socket: { remoteAddress: '10.0.0.1' },
        path: '/api/auth/other',
        body: { email: 'user@example.com' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
      };
      const next = jest.fn();
      
      const mockLimiter = {
        get: jest.fn().mockReturnValue({ count: 5, resetTime: Date.now() + 60000 }),
        set: jest.fn(),
        has: jest.fn().mockReturnValue(true),
      };
      
      (LRUCache as jest.Mock).mockImplementation(() => mockLimiter);
      
      // Act
      const middleware = applyAuthRateLimit();
      middleware(req as any, res as any, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 10); // Default limit
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 5);
    });
  });
});
