import Tokens from 'csrf';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize CSRF tokens
const tokens = new Tokens();

// CSRF token expiration time (1 hour)
const TOKEN_EXPIRATION = 60 * 60 * 1000;

/**
 * Interface for CSRF token data
 */
interface CsrfTokenData {
  token: string;
  secret: string;
  expires: number;
}

/**
 * Generate a new CSRF token and secret for a user
 * @param userId - User ID to generate token for
 * @returns CSRF token
 */
export async function generateCsrfToken(userId: string): Promise<string> {
  try {
    // Generate a new secret
    const secret = tokens.secretSync();
    
    // Create a token from the secret
    const token = tokens.create(secret);
    
    // Calculate expiration time
    const expires = Date.now() + TOKEN_EXPIRATION;
    
    // Store token data in user's session
    const { error } = await supabase
      .from('user_sessions')
      .upsert({
        user_id: userId,
        csrf_secret: secret,
        csrf_expires: new Date(expires).toISOString()
      }, {
        onConflict: 'user_id'
      });
    
    if (error) {
      logger.error('Error storing CSRF token:', error);
      throw new Error('Failed to store CSRF token');
    }
    
    return token;
  } catch (error) {
    logger.error('Error generating CSRF token:', error);
    throw new Error('Failed to generate CSRF token');
  }
}

/**
 * Verify a CSRF token for a user
 * @param userId - User ID to verify token for
 * @param token - CSRF token to verify
 * @returns Boolean indicating if token is valid
 */
export async function verifyCsrfToken(userId: string, token: string): Promise<boolean> {
  try {
    // Get the secret from the user's session
    const { data, error } = await supabase
      .from('user_sessions')
      .select('csrf_secret, csrf_expires')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      logger.error('Error retrieving CSRF secret:', error);
      return false;
    }
    
    const { csrf_secret: secret, csrf_expires: expiresStr } = data;
    
    // Check if token is expired
    const expires = new Date(expiresStr).getTime();
    if (Date.now() > expires) {
      logger.warn('CSRF token expired for user:', userId);
      return false;
    }
    
    // Verify the token
    return tokens.verify(secret, token);
  } catch (error) {
    logger.error('Error verifying CSRF token:', error);
    return false;
  }
}

/**
 * Middleware to verify CSRF token in request
 * @param req - Request object
 * @param res - Response object
 * @param next - Next function
 */
export function csrfProtection(req: any, res: any, next: any) {
  // Get user ID from request
  const userId = req.user?.id;
  
  // If no user ID, skip CSRF check (unauthenticated request)
  if (!userId) {
    return next();
  }
  
  // Get token from request header or body
  const token = req.headers['x-csrf-token'] || req.body?._csrf;
  
  if (!token) {
    logger.warn('Missing CSRF token in request');
    return res.status(403).json({ error: 'CSRF token missing' });
  }
  
  // Verify token
  verifyCsrfToken(userId, token)
    .then(valid => {
      if (valid) {
        next();
      } else {
        logger.warn('Invalid CSRF token:', { userId, token });
        res.status(403).json({ error: 'Invalid CSRF token' });
      }
    })
    .catch(error => {
      logger.error('Error in CSRF protection middleware:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
}

/**
 * React hook to get CSRF token for forms
 * @returns Object with CSRF token and function to refresh it
 */
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Get current user
  const { user } = useAuth();
  
  // Function to get a new CSRF token
  const refreshToken = React.useCallback(async () => {
    if (!user) {
      setCsrfToken(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const token = await generateCsrfToken(user.id);
      setCsrfToken(token);
    } catch (err) {
      setError('Failed to generate CSRF token');
      console.error('Error generating CSRF token:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Get token on component mount or when user changes
  React.useEffect(() => {
    refreshToken();
  }, [user, refreshToken]);
  
  return { csrfToken, refreshToken, loading, error };
}

/**
 * Add CSRF token to form data
 * @param formData - Form data to add token to
 * @param token - CSRF token
 * @returns Form data with token added
 */
export function addCsrfToken(formData: FormData, token: string): FormData {
  formData.append('_csrf', token);
  return formData;
}

/**
 * Add CSRF token to request headers
 * @param headers - Headers object to add token to
 * @param token - CSRF token
 * @returns Headers with token added
 */
export function addCsrfHeader(headers: Record<string, string>, token: string): Record<string, string> {
  return {
    ...headers,
    'X-CSRF-Token': token
  };
}

/**
 * Create a CSRF-protected fetch function
 * @param token - CSRF token
 * @returns Fetch function with CSRF protection
 */
export function createProtectedFetch(token: string) {
  return async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...(options.headers || {}),
      'X-CSRF-Token': token
    };
    
    return fetch(url, {
      ...options,
      headers
    });
  };
}
