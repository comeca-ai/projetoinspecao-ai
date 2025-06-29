import { jwtDecode } from 'jwt-decode';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';
import { logger } from '@/utils/logger';

// JWT payload interface
export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  exp: number;
  [key: string]: any;
}

// Session timeout in milliseconds (30 minutes)
export const SESSION_TIMEOUT = 30 * 60 * 1000;

// Maximum session duration (7 days)
export const MAX_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

// Validate JWT token
export const validateToken = (token: string): boolean => {
  try {
    if (!token) return false;
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    logger.error('Token validation error:', error as Error);
    return false;
  }
};

// Get token expiration time
export const getTokenExpiration = (token: string): number | null => {
  try {
    if (!token) return null;
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    logger.error('Error getting token expiration:', error as Error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const exp = getTokenExpiration(token);
  if (!exp) return true;
  return Date.now() >= exp;
};

// Refresh session if token is about to expire
export const refreshSessionIfNeeded = async (token: string): Promise<{
  success: boolean;
  session?: any;
  error?: string;
}> => {
  try {
    if (!token) {
      return { success: false, error: 'No token provided' };
    }

    const exp = getTokenExpiration(token);
    if (!exp) {
      return { success: false, error: 'Invalid token' };
    }

    // If token expires in less than 5 minutes, refresh it
    const fiveMinutes = 5 * 60 * 1000;
    if (exp - Date.now() < fiveMinutes) {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        logger.error('Error refreshing session:', error);
        return { success: false, error: error?.message || 'Failed to refresh session' };
      }
      
      return { success: true, session: data.session };
    }
    
    return { success: true };
  } catch (error) {
    logger.error('Error in refreshSessionIfNeeded:', error as Error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Validate user session
export const validateSession = async (token: string): Promise<{
  valid: boolean;
  user?: User | null;
  error?: string;
}> => {
  try {
    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    // Check if token is valid
    if (isTokenExpired(token)) {
      // Try to refresh the token
      const refreshResult = await refreshSessionIfNeeded(token);
      if (!refreshResult.success) {
        return { valid: false, error: 'Session expired' };
      }
      
      // If session was refreshed, use the new token
      if (refreshResult.session) {
        token = refreshResult.session.access_token;
      }
    }

    // Get user from token
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      logger.warn('Invalid session token', { error: error?.message });
      return { valid: false, error: 'Invalid session' };
    }

    // Get user role from JWT
    const decoded = jwtDecode<JwtPayload>(token);
    const role = decoded.role || data.user.user_metadata?.role || 'inspetor';

    // Map to our User type
    const user: User = {
      id: data.user.id,
      email: data.user.email || '',
      nome: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Usuário',
      role: role as any,
      plano: role === 'admin' ? 'enterprise' : role === 'gestor' ? 'profissional' : 'iniciante',
      created_at: data.user.created_at,
      equipe_id: data.user.user_metadata?.equipe_id,
      cliente_id: data.user.user_metadata?.cliente_id,
      access_token: token,
    };

    return { valid: true, user };
  } catch (error) {
    logger.error('Error validating session:', error as Error);
    return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Set up automatic session refresh
export const setupSessionRefresh = (
  expiresAt: Date | null,
  onRefresh: (session: any) => void
): (() => void) => {
  if (!expiresAt) return () => {};
  
  const now = new Date();
  const expiresIn = expiresAt.getTime() - now.getTime();
  
  // Refresh token 5 minutes before it expires
  const refreshTime = Math.max(0, expiresIn - (5 * 60 * 1000));
  
  const timeoutId = window.setTimeout(async () => {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (!error && data.session) {
      onRefresh(data.session);
      
      // Set up next refresh
      if (data.session.expires_at) {
        setupSessionRefresh(
          new Date(data.session.expires_at * 1000),
          onRefresh
        );
      }
    } else {
      logger.error('Failed to refresh session:', error);
    }
  }, refreshTime);
  
  return () => window.clearTimeout(timeoutId);
};

// Implement secure password policies
export const validatePassword = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Add session timeout and automatic logout
export const setupSessionTimeout = (
  onTimeout: () => void,
  timeout = SESSION_TIMEOUT
): (() => void) => {
  let timeoutId: number;
  let lastActivity = Date.now();
  
  // Reset timer on user activity
  const resetTimer = () => {
    lastActivity = Date.now();
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(checkInactivity, timeout);
  };
  
  // Check if user has been inactive
  const checkInactivity = () => {
    const now = Date.now();
    const inactiveTime = now - lastActivity;
    
    if (inactiveTime >= timeout) {
      onTimeout();
    } else {
      // Recalculate remaining time
      const remainingTime = timeout - inactiveTime;
      timeoutId = window.setTimeout(checkInactivity, remainingTime);
    }
  };
  
  // Set up event listeners for user activity
  const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
  activityEvents.forEach(event => {
    window.addEventListener(event, resetTimer);
  });
  
  // Start the initial timer
  timeoutId = window.setTimeout(checkInactivity, timeout);
  
  // Return cleanup function
  return () => {
    window.clearTimeout(timeoutId);
    activityEvents.forEach(event => {
      window.removeEventListener(event, resetTimer);
    });
  };
};
