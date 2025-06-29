/**
 * Tests for the validation utility
 * 
 * These tests verify that our validation and sanitization utilities work correctly
 * and properly handle input validation, sanitization, and error formatting.
 */

import { 
  validateInput, 
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateUrl,
  validateUuid,
  validateDate,
  sanitizeHtml
} from '@/utils/validation';
import { z } from 'zod';

// Mock DOMPurify
jest.mock('dompurify', () => ({
  sanitize: jest.fn((input) => `sanitized:${input}`),
}));

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  }
}));

describe('Validation Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateInput', () => {
    test('validateInput should return success for valid input', () => {
      // Arrange
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(18)
      });
      const input = { name: 'John', age: 25 };
      
      // Act
      const result = validateInput(schema, input);
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(input);
      expect(result.errors).toBeUndefined();
    });

    test('validateInput should return errors for invalid input', () => {
      // Arrange
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(18)
      });
      const input = { name: '', age: 16 };
      
      // Act
      const result = validateInput(schema, input);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    test('validateInput should format errors correctly', () => {
      // Arrange
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(18)
      });
      const input = { name: '', age: 16 };
      
      // Act
      const result = validateInput(schema, input);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        path: expect.any(Array),
        message: expect.any(String)
      }));
    });

    test('validateInput should handle unexpected errors', () => {
      // Arrange
      const schema = z.object({
        name: z.string().min(1)
      });
      const input = null;
      
      // Act
      const result = validateInput(schema, input as any);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('sanitizeInput', () => {
    test('sanitizeInput should sanitize string input', () => {
      // Arrange
      const input = '<script>alert("XSS")</script>';
      
      // Act
      const result = sanitizeInput(input);
      
      // Assert
      expect(result).toBe('sanitized:<script>alert("XSS")</script>');
    });

    test('sanitizeInput should sanitize object input recursively', () => {
      // Arrange
      const input = {
        name: '<b>John</b>',
        description: '<script>alert("XSS")</script>',
        nested: {
          content: '<img src="x" onerror="alert(1)">'
        }
      };
      
      // Act
      const result = sanitizeInput(input);
      
      // Assert
      expect(result).toEqual({
        name: 'sanitized:<b>John</b>',
        description: 'sanitized:<script>alert("XSS")</script>',
        nested: {
          content: 'sanitized:<img src="x" onerror="alert(1)">'
        }
      });
    });

    test('sanitizeInput should handle arrays', () => {
      // Arrange
      const input = [
        '<script>alert(1)</script>',
        '<b>Valid HTML</b>',
        { text: '<img src="x" onerror="alert(1)">' }
      ];
      
      // Act
      const result = sanitizeInput(input);
      
      // Assert
      expect(result).toEqual([
        'sanitized:<script>alert(1)</script>',
        'sanitized:<b>Valid HTML</b>',
        { text: 'sanitized:<img src="x" onerror="alert(1)">' }
      ]);
    });

    test('sanitizeInput should return non-string/object/array values as is', () => {
      // Arrange
      const inputs = [123, true, null, undefined];
      
      // Act & Assert
      inputs.forEach(input => {
        expect(sanitizeInput(input)).toBe(input);
      });
    });
  });

  describe('Specific Validators', () => {
    test('validateEmail should validate email addresses', () => {
      // Valid emails
      expect(validateEmail('user@example.com').success).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk').success).toBe(true);
      
      // Invalid emails
      expect(validateEmail('not-an-email').success).toBe(false);
      expect(validateEmail('missing@domain').success).toBe(false);
      expect(validateEmail('@example.com').success).toBe(false);
    });

    test('validatePassword should validate password strength', () => {
      // Valid password
      expect(validatePassword('StrongP@ss123').success).toBe(true);
      
      // Invalid passwords
      expect(validatePassword('weak').success).toBe(false);
      expect(validatePassword('NoSpecialChars123').success).toBe(false);
      expect(validatePassword('nodigits@').success).toBe(false);
    });

    test('validateName should validate names', () => {
      // Valid names
      expect(validateName('John Doe').success).toBe(true);
      expect(validateName('María-José').success).toBe(true);
      
      // Invalid names
      expect(validateName('').success).toBe(false);
      expect(validateName('a').success).toBe(false); // Too short
      expect(validateName('John123').success).toBe(false); // Contains numbers
    });

    test('validatePhone should validate phone numbers', () => {
      // Valid phone numbers
      expect(validatePhone('+1-555-123-4567').success).toBe(true);
      expect(validatePhone('(555) 123-4567').success).toBe(true);
      expect(validatePhone('5551234567').success).toBe(true);
      
      // Invalid phone numbers
      expect(validatePhone('not-a-phone').success).toBe(false);
      expect(validatePhone('123').success).toBe(false); // Too short
    });

    test('validateUrl should validate URLs', () => {
      // Valid URLs
      expect(validateUrl('https://example.com').success).toBe(true);
      expect(validateUrl('http://sub.domain.co.uk/path?query=1').success).toBe(true);
      
      // Invalid URLs
      expect(validateUrl('not-a-url').success).toBe(false);
      expect(validateUrl('ftp://example.com').success).toBe(false); // Not http/https
    });

    test('validateUuid should validate UUIDs', () => {
      // Valid UUID
      expect(validateUuid('123e4567-e89b-12d3-a456-426614174000').success).toBe(true);
      
      // Invalid UUIDs
      expect(validateUuid('not-a-uuid').success).toBe(false);
      expect(validateUuid('123e4567-e89b-12d3-a456').success).toBe(false); // Incomplete
    });

    test('validateDate should validate dates', () => {
      // Valid dates
      expect(validateDate('2023-01-15').success).toBe(true);
      expect(validateDate('01/15/2023').success).toBe(true);
      
      // Invalid dates
      expect(validateDate('not-a-date').success).toBe(false);
      expect(validateDate('2023-13-01').success).toBe(false); // Invalid month
    });
  });

  describe('sanitizeHtml', () => {
    test('sanitizeHtml should remove dangerous HTML', () => {
      // Arrange
      const dangerousHtml = '<div>Safe content <script>alert("XSS")</script></div>';
      
      // Act
      const result = sanitizeHtml(dangerousHtml);
      
      // Assert
      expect(result).toBe('sanitized:<div>Safe content <script>alert("XSS")</script></div>');
    });

    test('sanitizeHtml should handle non-string input', () => {
      // Act & Assert
      expect(sanitizeHtml(null as any)).toBe('');
      expect(sanitizeHtml(undefined as any)).toBe('');
      expect(sanitizeHtml(123 as any)).toBe('123');
    });
  });
});
