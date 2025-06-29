import { createHash, randomBytes } from 'crypto';

// CSRF token interface
export interface CsrfToken {
  token: string;
  expires: Date;
}

// In-memory store for CSRF tokens (in production, use Redis or similar)
const csrfTokens = new Map<string, CsrfToken>();

// Generate a new CSRF token
export function generateCsrfToken(userId: string): string {
  // Generate a random token
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  // Store the token with user ID as the key
  csrfTokens.set(userId, { token, expires });
  
  // Clean up expired tokens
  cleanupExpiredTokens();
  
  return token;
}

// Verify a CSRF token
export function verifyCsrfToken(userId: string, token: string): boolean {
  const storedToken = csrfTokens.get(userId);
  
  if (!storedToken) {
    return false;
  }
  
  // Check if token is valid and not expired
  const isValid = 
    storedToken.token === token && 
    storedToken.expires > new Date();
  
  // Remove the token after verification (one-time use)
  if (isValid) {
    csrfTokens.delete(userId);
  }
  
  return isValid;
}

// Generate a CSRF token hash for form submission
export function generateCsrfHash(token: string, secret: string): string {
  return createHash('sha256')
    .update(`${token}${secret}`)
    .digest('hex');
}

// Verify a CSRF hash
export function verifyCsrfHash(token: string, hash: string, secret: string): boolean {
  const expectedHash = generateCsrfHash(token, secret);
  return expectedHash === hash;
}

// Clean up expired tokens
function cleanupExpiredTokens(): void {
  const now = new Date();
  
  for (const [userId, token] of csrfTokens.entries()) {
    if (token.expires <= now) {
      csrfTokens.delete(userId);
    }
  }
}

// Middleware to validate CSRF token for API routes
export function csrfProtection(req: Request, secret: string): { isValid: boolean; error?: string } {
  // Skip CSRF check for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return { isValid: true };
  }
  
  // Get token from headers or body
  const csrfToken = 
    req.headers.get('x-csrf-token') || 
    (req as any).body?.csrfToken;
    
  const userId = req.headers.get('x-user-id') || 
                (req as any).body?.userId;
  
  if (!csrfToken || !userId) {
    return { 
      isValid: false, 
      error: 'CSRF token and user ID are required' 
    };
  }
  
  // Verify the token
  const isValid = verifyCsrfToken(userId, csrfToken);
  
  if (!isValid) {
    return { 
      isValid: false, 
      error: 'Invalid or expired CSRF token' 
    };
  }
  
  return { isValid: true };
}
