import { z } from 'zod';
import { UserRole } from '@/types/auth';
import DOMPurify from 'dompurify';

// Common validation schemas
export const emailSchema = z.string().email('E-mail inválido').toLowerCase().trim();

export const passwordSchema = z.string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial');

export const nameSchema = z.string()
  .min(2, 'O nome deve ter no mínimo 2 caracteres')
  .max(100, 'O nome deve ter no máximo 100 caracteres')
  .regex(/^[\p{L}\s-]+$/u, 'O nome contém caracteres inválidos')
  .trim();

// User role validation
export const userRoleSchema = z.enum(['admin', 'gestor', 'inspetor']) as z.ZodType<UserRole>;

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  senha: z.string().min(1, 'A senha é obrigatória'),
  rememberMe: z.boolean().optional(),
});

// Registration validation schema
export const registerSchema = z.object({
  email: emailSchema,
  senha: passwordSchema,
  nome: nameSchema,
  role: userRoleSchema.default('inspetor'),
  equipe_id: z.string().uuid('ID de equipe inválido').optional(),
  cliente_id: z.string().uuid('ID de cliente inválido').optional(),
});

// Password reset validation schema
export const resetPasswordSchema = z.object({
  email: emailSchema,
});

// Inspection validation schema
export const inspectionSchema = z.object({
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres').max(100, 'O título deve ter no máximo 100 caracteres').trim(),
  location: z.string().min(3, 'O local deve ter no mínimo 3 caracteres').max(200, 'O local deve ter no máximo 200 caracteres').trim(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida. Use o formato YYYY-MM-DD'),
  responsible: z.string().min(3, 'O responsável deve ter no mínimo 3 caracteres').max(100, 'O responsável deve ter no máximo 100 caracteres').trim(),
  type: z.string().min(2, 'O tipo deve ter no mínimo 2 caracteres').max(50, 'O tipo deve ter no máximo 50 caracteres').trim(),
  team_id: z.string().uuid('ID de equipe inválido'),
  client_id: z.string().uuid('ID de cliente inválido').optional(),
  template_id: z.string().uuid('ID de template inválido').optional(),
  notes: z.string().max(1000, 'As notas devem ter no máximo 1000 caracteres').optional(),
});

// Test validation schema
export const testSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').max(100, 'O nome deve ter no máximo 100 caracteres').trim(),
  description: z.string().min(5, 'A descrição deve ter no mínimo 5 caracteres').max(500, 'A descrição deve ter no máximo 500 caracteres').trim(),
  category: z.string().min(2, 'A categoria deve ter no mínimo 2 caracteres').max(50, 'A categoria deve ter no máximo 50 caracteres').trim(),
  expected_result: z.string().min(3, 'O resultado esperado deve ter no mínimo 3 caracteres').max(200, 'O resultado esperado deve ter no máximo 200 caracteres').trim(),
  template_id: z.string().uuid('ID de template inválido').optional(),
});

// Team validation schema
export const teamSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').max(100, 'O nome deve ter no máximo 100 caracteres').trim(),
  description: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').optional(),
  client_id: z.string().uuid('ID de cliente inválido').optional(),
});

// Client validation schema
export const clientSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').max(100, 'O nome deve ter no máximo 100 caracteres').trim(),
  tax_id: z.string().min(11, 'CNPJ/CPF inválido').max(18, 'CNPJ/CPF inválido').trim(),
  contact_email: emailSchema.optional(),
  contact_phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Telefone inválido').optional(),
  address: z.string().max(200, 'O endereço deve ter no máximo 200 caracteres').optional(),
});

// Template validation schema
export const templateSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').max(100, 'O nome deve ter no máximo 100 caracteres').trim(),
  description: z.string().min(5, 'A descrição deve ter no mínimo 5 caracteres').max(500, 'A descrição deve ter no máximo 500 caracteres').trim(),
  category: z.string().min(2, 'A categoria deve ter no mínimo 2 caracteres').max(50, 'A categoria deve ter no máximo 50 caracteres').trim(),
  team_id: z.string().uuid('ID de equipe inválido'),
});

// URL validation schema
export const urlSchema = z.string().url('URL inválida').trim();

// Phone number validation schema
export const phoneSchema = z.string().regex(/^\+?[0-9]{10,15}$/, 'Número de telefone inválido');

// Date validation schema
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida. Use o formato YYYY-MM-DD');

// UUID validation schema
export const uuidSchema = z.string().uuid('ID inválido');

// Input sanitization function with DOMPurify for better XSS protection
export function sanitizeInput<T>(input: unknown, schema: z.ZodSchema<T>): T {
  if (typeof input === 'string') {
    // Use DOMPurify for better XSS protection
    let sanitizedInput = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [], // No attributes allowed
      KEEP_CONTENT: true // Keep content of removed tags
    });
    
    // Additional sanitization for common attack vectors
    sanitizedInput = sanitizedInput
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      // Prevent SQL injection attempts
      .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|CREATE|WHERE)\b/gi, '')
      // Prevent script injection
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
      
    input = sanitizedInput;
  } else if (typeof input === 'object' && input !== null) {
    // Recursively sanitize object properties
    const sanitizedObj = { ...input } as Record<string, any>;
    Object.entries(sanitizedObj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        sanitizedObj[key] = sanitizeInput(value, z.string());
      } else if (typeof value === 'object' && value !== null) {
        sanitizedObj[key] = sanitizeInput(value, z.any());
      }
    });
    input = sanitizedObj;
  }
  
  return schema.parse(input);
}

// Validate and sanitize user input
export async function validateInput<T>(input: unknown, schema: z.ZodSchema<T>): Promise<{
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  originalInput?: unknown;
}> {
  try {
    // Store original input for logging/debugging purposes
    const originalInput = JSON.parse(JSON.stringify(input));
    
    // Sanitize and validate
    const sanitized = sanitizeInput(input, z.any());
    const result = await schema.safeParseAsync(sanitized);
    
    if (result.success) {
      return { success: true, data: result.data };
    }
    
    // Format validation errors
    const errors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.') || '_error';
      // If we already have an error for this path, append the new one
      if (errors[path]) {
        errors[path] += '; ' + issue.message;
      } else {
        errors[path] = issue.message;
      }
    });
    
    // Log validation failures for security monitoring
    console.warn('Validation failed:', {
      errors,
      inputType: typeof input,
      schemaName: schema.description || 'unknown'
    });
    
    return { success: false, errors, originalInput };
  } catch (error) {
    console.error('Validation error:', error);
    return { 
      success: false, 
      errors: { _error: 'Erro ao validar os dados. Por favor, tente novamente.' } 
    };
  }
}
