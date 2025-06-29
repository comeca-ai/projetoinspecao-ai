/**
 * Tests for the authUtils utility
 * 
 * These tests verify that our authentication utilities work correctly
 * and properly handle JWT tokens, session management, and password validation.
 */

import { 
  validateToken, 
  getTokenExpiration, 
  isTokenExpired,
  validatePassword,
  JwtPayload
} from '@/utils/authUtils';
import { jwtDecode } from 'jwt-decode';

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn()
}));

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  }
}));

describe('Authentication Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Token Validation', () => {
    test('validateToken should return true for valid token', () => {
      // Arrange
      const token = 'valid.jwt.token';
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour in the future
      (jwtDecode as jest.Mock).mockReturnValue({ exp: futureTime });
      
      // Act
      const result = validateToken(token);
      
      // Assert
      expect(result).toBe(true);
      expect(jwtDecode).toHaveBeenCalledWith(token);
    });

    test('validateToken should return false for expired token', () => {
      // Arrange
      const token = 'expired.jwt.token';
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour in the past
      (jwtDecode as jest.Mock).mockReturnValue({ exp: pastTime });
      
      // Act
      const result = validateToken(token);
      
      // Assert
      expect(result).toBe(false);
      expect(jwtDecode).toHaveBeenCalledWith(token);
    });

    test('validateToken should return false for empty token', () => {
      // Act
      const result = validateToken('');
      
      // Assert
      expect(result).toBe(false);
      expect(jwtDecode).not.toHaveBeenCalled();
    });

    test('validateToken should return false and log error on exception', () => {
      // Arrange
      const token = 'invalid.jwt.token';
      (jwtDecode as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      // Act
      const result = validateToken(token);
      
      // Assert
      expect(result).toBe(false);
      expect(jwtDecode).toHaveBeenCalledWith(token);
    });
  });

  describe('Token Expiration', () => {
    test('getTokenExpiration should return expiration time in milliseconds', () => {
      // Arrange
      const token = 'valid.jwt.token';
      const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour in the future
      (jwtDecode as jest.Mock).mockReturnValue({ exp: expirationTime });
      
      // Act
      const result = getTokenExpiration(token);
      
      // Assert
      expect(result).toBe(expirationTime * 1000); // Should convert to milliseconds
      expect(jwtDecode).toHaveBeenCalledWith(token);
    });

    test('getTokenExpiration should return null for empty token', () => {
      // Act
      const result = getTokenExpiration('');
      
      // Assert
      expect(result).toBeNull();
      expect(jwtDecode).not.toHaveBeenCalled();
    });

    test('getTokenExpiration should return null and log error on exception', () => {
      // Arrange
      const token = 'invalid.jwt.token';
      (jwtDecode as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      // Act
      const result = getTokenExpiration(token);
      
      // Assert
      expect(result).toBeNull();
      expect(jwtDecode).toHaveBeenCalledWith(token);
    });

    test('isTokenExpired should return true for expired token', () => {
      // Arrange
      const token = 'expired.jwt.token';
      const pastTime = (Date.now() - 3600000) / 1000; // 1 hour in the past
      (jwtDecode as jest.Mock).mockReturnValue({ exp: pastTime });
      
      // Act
      const result = isTokenExpired(token);
      
      // Assert
      expect(result).toBe(true);
      expect(jwtDecode).toHaveBeenCalledWith(token);
    });

    test('isTokenExpired should return false for valid token', () => {
      // Arrange
      const token = 'valid.jwt.token';
      const futureTime = (Date.now() + 3600000) / 1000; // 1 hour in the future
      (jwtDecode as jest.Mock).mockReturnValue({ exp: futureTime });
      
      // Act
      const result = isTokenExpired(token);
      
      // Assert
      expect(result).toBe(false);
      expect(jwtDecode).toHaveBeenCalledWith(token);
    });
  });

  describe('Password Validation', () => {
    test('validatePassword should return valid for strong password', () => {
      // Arrange
      const strongPassword = 'StrongP@ss123';
      
      // Act
      const result = validatePassword(strongPassword);
      
      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('validatePassword should return errors for weak password', () => {
      // Arrange
      const weakPassword = 'password';
      
      // Act
      const result = validatePassword(weakPassword);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('validatePassword should check for minimum length', () => {
      // Arrange
      const shortPassword = 'Abc123!';
      
      // Act
      const result = validatePassword(shortPassword);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    test('validatePassword should check for uppercase letters', () => {
      // Arrange
      const noUppercasePassword = 'password123!';
      
      // Act
      const result = validatePassword(noUppercasePassword);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    test('validatePassword should check for lowercase letters', () => {
      // Arrange
      const noLowercasePassword = 'PASSWORD123!';
      
      // Act
      const result = validatePassword(noLowercasePassword);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    test('validatePassword should check for numbers', () => {
      // Arrange
      const noNumberPassword = 'Password!';
      
      // Act
      const result = validatePassword(noNumberPassword);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    test('validatePassword should check for special characters', () => {
      // Arrange
      const noSpecialCharPassword = 'Password123';
      
      // Act
      const result = validatePassword(noSpecialCharPassword);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });
});
