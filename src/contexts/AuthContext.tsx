import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthState, LoginCredentials, RegisterData, UserRole } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { 
  validateToken, 
  isTokenExpired, 
  getTokenExpiration, 
  setupSessionRefresh, 
  setupSessionTimeout,
  SESSION_TIMEOUT,
  validateSession,
  refreshSessionIfNeeded,
  JwtPayload
} from '@/utils/authUtils';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  isTokenExpired: (token: string) => boolean;
  getTokenExpiration: (token: string) => number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Using imported functions from authUtils.ts

  // Map Supabase user to our app's user type with JWT validation
  const mapSupabaseUser = useCallback(async (user: SupabaseUser | null): Promise<User | null> => {
    // Helper function to validate user role
    const validateUserRole = (role: unknown): UserRole => {
      if (role === 'admin' || role === 'gestor' || role === 'inspetor') {
        return role;
      }
      // Throw an error if the role is invalid
      throw new Error(`Invalid user role: ${role}`);
    };
    if (!user) return null;

    try {
      // Get the current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.error('Error getting session:', error);
        return null;
      }

      // Validate the access token
      if (isTokenExpired(session.access_token)) {
        console.log('Access token expired, attempting to refresh...');
        const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshedSession) {
          console.error('Error refreshing session:', refreshError);
          await supabase.auth.signOut();
          return null;
        }
      }

      // Get the user role from the JWT or user metadata
      let userRole: UserRole = 'inspetor'; // Default role
      
      try {
        const jwtData = jwtDecode<JwtPayload>(session.access_token);
        const roleFromJwt = jwtData.role as UserRole;
        const roleFromMetadata = user.user_metadata?.role as UserRole;
        
        // Validate the role is one of the allowed values
        if (roleFromJwt && ['admin', 'gestor', 'inspetor'].includes(roleFromJwt)) {
          userRole = roleFromJwt;
        } else if (roleFromMetadata && ['admin', 'gestor', 'inspetor'].includes(roleFromMetadata)) {
          userRole = roleFromMetadata;
        }
      } catch (jwtError) {
        console.error('Error decoding JWT:', jwtError);
        const roleFromMetadata = user.user_metadata?.role as UserRole;
        if (roleFromMetadata && ['admin', 'gestor', 'inspetor'].includes(roleFromMetadata)) {
          userRole = roleFromMetadata;
        }
      }
      
      return {
        id: user.id,
        email: user.email || '',
        nome: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
        role: userRole,
        plano: userRole === 'admin' ? 'enterprise' : userRole === 'gestor' ? 'profissional' : 'iniciante',
        created_at: user.created_at,
        equipe_id: user.user_metadata?.equipe_id,
        cliente_id: user.user_metadata?.cliente_id,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at ? new Date(session.expires_at * 1000) : null,
      };
    } catch (error) {
      console.error('Error in mapSupabaseUser:', error);
      return null;
    }
  }, [isTokenExpired]);

  // Refresh the current session
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        setState({
          user: null,
          loading: false,
          error: error.message
        });
        return false;
      }
      
      if (!session) {
        setState({
          user: null,
          loading: false,
          error: 'No active session'
        });
        return false;
      }
      
      const user = await mapSupabaseUser(session.user);
      
      setState({
        user,
        loading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error('Error in refreshSession:', error);
      setState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh session',
      });
      return false;
    }
  }, [mapSupabaseUser]);

  // Check for active session and set the user
  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        setState({
          user: null,
          loading: false,
          error: null,
        });
        return;
      }
      
      const user = await mapSupabaseUser(session.user);
      
      setState({
        user,
        loading: false,
        error: null,
      });
      
    } catch (error) {
      console.error('Error checking auth:', error);
      setState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check authentication',
      });
    }
  }, [mapSupabaseUser]);

  // Set up auth state listener
  useEffect(() => {
    // Check initial auth state
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          mapSupabaseUser(session?.user || null).then(user => {
            setState(prev => ({
              ...prev,
              user,
              error: null,
            }));
          });
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({
            ...prev,
            user: null,
            error: null,
          }));
        } else if (event === 'TOKEN_REFRESHED') {
          // Handle token refresh if needed
        }
      },
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [checkAuth, mapSupabaseUser]);

  // Set up session refresh timer with the new utility function
  const handleSessionRefresh = useCallback((session: any) => {
    // Map the user from the refreshed session
    mapSupabaseUser(session.user).then(user => {
      if (user) {
        setState(prev => ({
          ...prev,
          user,
          loading: false,
          error: null,
        }));
      }
    });
  }, [mapSupabaseUser]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.senha,
      });

      if (error || !user || !session) {
        throw error || new Error('Falha no login. Verifique suas credenciais.');
      }

      // Validate the session token
      if (isTokenExpired(session.access_token)) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

      const mappedUser = await mapSupabaseUser(user);
      if (!mappedUser) {
        throw new Error('Falha ao mapear usuário.');
      }

      // Set up session refresh
      if (session.expires_at) {
        const cleanupRefresh = setupSessionRefresh(
          new Date(session.expires_at * 1000),
          handleSessionRefresh
        );
        
        // Set up session timeout for automatic logout
        const cleanupTimeout = setupSessionTimeout(() => {
          logout();
          alert('Sua sessão expirou devido à inatividade. Por favor, faça login novamente.');
        });
        
        // Store cleanup functions
        const cleanupFunctions = {
          refresh: cleanupRefresh,
          timeout: cleanupTimeout
        };
        
        // Store cleanup functions in user object
        mappedUser.cleanup = cleanupFunctions;
      }

      setState(prev => ({
        ...prev,
        user: mappedUser,
        loading: false,
        error: null,
      }));

      return mappedUser;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.error_description || error.message || 'Erro ao fazer login. Verifique suas credenciais.';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      throw error;
    }
  }, [isTokenExpired, mapSupabaseUser, handleSessionRefresh]);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Clear any active timers
      if (state.user?.cleanup) {
        if (state.user.cleanup.refresh) state.user.cleanup.refresh();
        if (state.user.cleanup.timeout) state.user.cleanup.timeout();
      }
      
      await supabase.auth.signOut();
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error during logout:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to logout',
      }));
      throw error;
    }
  }, [state.user]);

  const register = async (data: RegisterData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // First, sign up the user with email and password
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
        options: {
          data: {
            full_name: data.nome,
            role: data.role,
            equipe_id: data.equipe_id,
            cliente_id: data.cliente_id,
          },
        },
      });
      
      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No user returned from registration');
      
      // Map the Supabase user to our app's user type
      const mappedUser = await mapSupabaseUser(authData.user);
      
      setState(prev => ({
        ...prev,
        user: mappedUser,
        loading: false,
        error: null,
      }));
      
      return mappedUser;
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.error_description || error.message || 'Erro ao criar conta. Tente novamente.';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
      
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorMessage = error.error_description || error.message || 'Erro ao enviar email de recuperação';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      throw error;
    }
  };

  // Provide the auth context value
  const contextValue = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
    refreshSession,
    isTokenExpired,
    getTokenExpiration,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};