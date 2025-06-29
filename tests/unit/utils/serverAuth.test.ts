/**
 * Tests for the serverAuth utility
 * 
 * These tests verify that our server-side authorization utilities work correctly
 * and properly handle role-based and resource-based permissions.
 */

import { 
  AuthorizationError,
  verifySession,
  checkUserRole,
  hasPermission,
  withPermission
} from '@/utils/serverAuth';

// Mock supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    }
  }
}));

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  }
}));

// Import mocked modules
import { supabase } from '@/lib/supabase';

describe('Server Authorization Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AuthorizationError', () => {
    test('AuthorizationError should extend Error', () => {
      // Arrange & Act
      const error = new AuthorizationError('Test error');
      
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('AuthorizationError');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(403);
    });

    test('AuthorizationError should accept custom status code', () => {
      // Arrange & Act
      const error = new AuthorizationError('Test error', 401);
      
      // Assert
      expect(error.statusCode).toBe(401);
    });
  });

  describe('verifySession', () => {
    test('verifySession should return user data for valid session', async () => {
      // Arrange
      const mockUser = { id: 'user-123', role: 'admin' };
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ 
        data: { user: mockUser },
        error: null
      });
      const token = 'valid.jwt.token';
      
      // Act
      const result = await verifySession(token);
      
      // Assert
      expect(result).toEqual(mockUser);
      expect(supabase.auth.getUser).toHaveBeenCalledWith(token);
    });

    test('verifySession should throw AuthorizationError for invalid session', async () => {
      // Arrange
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ 
        data: { user: null },
        error: { message: 'Invalid JWT' }
      });
      const token = 'invalid.jwt.token';
      
      // Act & Assert
      await expect(verifySession(token)).rejects.toThrow(AuthorizationError);
      expect(supabase.auth.getUser).toHaveBeenCalledWith(token);
    });

    test('verifySession should throw AuthorizationError for empty token', async () => {
      // Act & Assert
      await expect(verifySession('')).rejects.toThrow(AuthorizationError);
      expect(supabase.auth.getUser).not.toHaveBeenCalled();
    });
  });

  describe('checkUserRole', () => {
    test('checkUserRole should return true for user with allowed role', () => {
      // Arrange
      const user = { id: 'user-123', role: 'admin' };
      const allowedRoles = ['admin', 'gestor'];
      
      // Act
      const result = checkUserRole(user, allowedRoles);
      
      // Assert
      expect(result).toBe(true);
    });

    test('checkUserRole should return false for user without allowed role', () => {
      // Arrange
      const user = { id: 'user-123', role: 'inspetor' };
      const allowedRoles = ['admin', 'gestor'];
      
      // Act
      const result = checkUserRole(user, allowedRoles);
      
      // Assert
      expect(result).toBe(false);
    });

    test('checkUserRole should handle user without role property', () => {
      // Arrange
      const user = { id: 'user-123' };
      const allowedRoles = ['admin', 'gestor'];
      
      // Act
      const result = checkUserRole(user as any, allowedRoles);
      
      // Assert
      expect(result).toBe(false);
    });
  });

  describe('hasPermission', () => {
    test('hasPermission should return true for user with direct permission', () => {
      // Arrange
      const user = { 
        id: 'user-123', 
        role: 'gestor',
        permissions: ['read:inspections', 'write:inspections']
      };
      
      // Act
      const result = hasPermission(user, 'read:inspections');
      
      // Assert
      expect(result).toBe(true);
    });

    test('hasPermission should return false for user without permission', () => {
      // Arrange
      const user = { 
        id: 'user-123', 
        role: 'inspetor',
        permissions: ['read:inspections']
      };
      
      // Act
      const result = hasPermission(user, 'write:inspections');
      
      // Assert
      expect(result).toBe(false);
    });

    test('hasPermission should handle user without permissions property', () => {
      // Arrange
      const user = { id: 'user-123', role: 'inspetor' };
      
      // Act
      const result = hasPermission(user as any, 'read:inspections');
      
      // Assert
      expect(result).toBe(false);
    });
  });

  describe('withPermission', () => {
    test('withPermission should call handler for authorized user', async () => {
      // Arrange
      const mockHandler = jest.fn().mockResolvedValue({ success: true });
      const mockUser = { 
        id: 'user-123', 
        role: 'admin',
        permissions: ['admin:all']
      };
      const wrappedHandler = withPermission('admin:all', mockHandler);
      
      // Act
      const result = await wrappedHandler(mockUser, { id: 'resource-123' });
      
      // Assert
      expect(result).toEqual({ success: true });
      expect(mockHandler).toHaveBeenCalledWith(mockUser, { id: 'resource-123' });
    });

    test('withPermission should throw AuthorizationError for unauthorized user', async () => {
      // Arrange
      const mockHandler = jest.fn().mockResolvedValue({ success: true });
      const mockUser = { 
        id: 'user-123', 
        role: 'inspetor',
        permissions: ['read:inspections']
      };
      const wrappedHandler = withPermission('admin:all', mockHandler);
      
      // Act & Assert
      await expect(wrappedHandler(mockUser, { id: 'resource-123' }))
        .rejects.toThrow(AuthorizationError);
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });
});
