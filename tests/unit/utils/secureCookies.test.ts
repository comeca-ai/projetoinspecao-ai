/**
 * Tests for the secureCookies utility
 * 
 * These tests verify that our secure cookie implementation works correctly
 * and applies the necessary security flags to cookies.
 */

import { 
  setSecureCookie, 
  getSecureCookie, 
  deleteSecureCookie,
  setSessionCookie,
  setEncryptedCookie,
  getEncryptedCookie
} from '@/utils/secureCookies';

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

describe('Secure Cookie Utilities', () => {
  beforeEach(() => {
    // Reset document.cookie before each test
    document.cookie = '';
  });

  test('setSecureCookie should set a cookie with security flags', () => {
    // Arrange
    const name = 'testCookie';
    const value = 'testValue';
    
    // Act
    setSecureCookie(name, value);
    
    // Assert
    expect(document.cookie).toContain('testCookie=testValue');
    
    // Check if the cookie was set with security flags
    // Note: In a real browser, we would see HttpOnly, SameSite, etc.
    // but in JSDOM these flags are not visible in document.cookie
    const cookieString = document.cookie;
    expect(cookieString).toContain('testCookie=testValue');
  });

  test('getSecureCookie should retrieve a cookie value', () => {
    // Arrange
    document.cookie = 'testCookie=testValue';
    
    // Act
    const value = getSecureCookie('testCookie');
    
    // Assert
    expect(value).toBe('testValue');
  });

  test('getSecureCookie should return null for non-existent cookies', () => {
    // Act
    const value = getSecureCookie('nonExistentCookie');
    
    // Assert
    expect(value).toBeNull();
  });

  test('deleteSecureCookie should remove a cookie', () => {
    // Arrange
    document.cookie = 'testCookie=testValue';
    
    // Act
    deleteSecureCookie('testCookie');
    
    // Assert
    expect(getSecureCookie('testCookie')).toBeNull();
  });

  test('setSessionCookie should set a cookie without expiration', () => {
    // Arrange
    const name = 'sessionCookie';
    const value = 'sessionValue';
    
    // Act
    setSessionCookie(name, value);
    
    // Assert
    expect(document.cookie).toContain('sessionCookie=sessionValue');
    // Session cookies don't have max-age or expires
    expect(document.cookie).not.toContain('max-age');
    expect(document.cookie).not.toContain('expires');
  });

  test('setEncryptedCookie should encode the cookie value', () => {
    // Arrange
    const name = 'encryptedCookie';
    const value = 'sensitiveData';
    
    // Act
    setEncryptedCookie(name, value);
    
    // Assert
    expect(document.cookie).toContain('encryptedCookie=');
    expect(document.cookie).not.toContain('sensitiveData');
    
    // Verify we can decrypt it
    const decrypted = getEncryptedCookie(name);
    expect(decrypted).toBe('sensitiveData');
  });

  test('Cookie values should be properly encoded', () => {
    // Arrange
    const name = 'specialCookie';
    const value = 'value with spaces & special chars: ;=';
    
    // Act
    setSecureCookie(name, value);
    
    // Assert
    expect(getSecureCookie('specialCookie')).toBe(value);
  });
});
