/**
 * Tests for the securityHeaders utility
 * 
 * These tests verify that our security headers implementation works correctly
 * and applies the necessary security headers to responses.
 */

import { 
  generateCSP, 
  getSecurityHeaders, 
  applySecurityHeaders 
} from '@/utils/securityHeaders';

describe('Security Headers Utilities', () => {
  test('generateCSP should create a valid CSP string', () => {
    // Act
    const csp = generateCSP();
    
    // Assert
    expect(csp).toContain('default-src');
    expect(csp).toContain('script-src');
    expect(csp).toContain('style-src');
    expect(csp).toContain('\'self\'');
  });

  test('generateCSP should merge additional directives', () => {
    // Arrange
    const additionalDirectives = {
      'img-src': ['https://example.com'],
      'connect-src': ['https://api.example.com'],
    };
    
    // Act
    const csp = generateCSP(additionalDirectives);
    
    // Assert
    expect(csp).toContain('img-src');
    expect(csp).toContain('https://example.com');
    expect(csp).toContain('connect-src');
    expect(csp).toContain('https://api.example.com');
  });

  test('getSecurityHeaders should return all required security headers', () => {
    // Act
    const headers = getSecurityHeaders();
    
    // Assert
    expect(headers).toHaveProperty('X-Content-Type-Options');
    expect(headers).toHaveProperty('X-Frame-Options');
    expect(headers).toHaveProperty('X-XSS-Protection');
    expect(headers).toHaveProperty('Strict-Transport-Security');
    expect(headers).toHaveProperty('Permissions-Policy');
    expect(headers).toHaveProperty('Referrer-Policy');
    expect(headers).toHaveProperty('Cache-Control');
  });

  test('getSecurityHeaders should include CSP when enabled', () => {
    // Act
    const headers = getSecurityHeaders(true);
    
    // Assert
    expect(headers).toHaveProperty('Content-Security-Policy');
  });

  test('getSecurityHeaders should not include CSP when disabled', () => {
    // Act
    const headers = getSecurityHeaders(false);
    
    // Assert
    expect(headers).not.toHaveProperty('Content-Security-Policy');
  });

  test('applySecurityHeaders should add headers to a response', () => {
    // Arrange
    const originalResponse = new Response('Test body', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    
    // Act
    const secureResponse = applySecurityHeaders(originalResponse);
    
    // Assert
    expect(secureResponse.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(secureResponse.headers.get('X-Frame-Options')).toBe('DENY');
    expect(secureResponse.headers.get('Content-Type')).toBe('text/plain');
    expect(secureResponse.status).toBe(200);
  });

  test('applySecurityHeaders should preserve original response properties', () => {
    // Arrange
    const originalResponse = new Response('Test body', {
      status: 404,
      statusText: 'Not Found',
      headers: {
        'Custom-Header': 'Custom Value',
      },
    });
    
    // Act
    const secureResponse = applySecurityHeaders(originalResponse);
    
    // Assert
    expect(secureResponse.status).toBe(404);
    expect(secureResponse.statusText).toBe('Not Found');
    expect(secureResponse.headers.get('Custom-Header')).toBe('Custom Value');
  });
});
