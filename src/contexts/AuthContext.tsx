import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        // TODO: Replace with actual Supabase auth check
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setState({
            user: JSON.parse(savedUser),
            loading: false,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setState({
          user: null,
          loading: false,
          error: 'Erro ao verificar autenticação',
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // TODO: Replace with actual Supabase auth
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user based on email for demo
      let mockUser: User;
      if (credentials.email.includes('admin')) {
        mockUser = {
          id: '1',
          email: credentials.email,
          nome: 'Admin Sistema',
          role: 'admin',
          plano: 'enterprise',
          created_at: new Date().toISOString(),
        };
      } else if (credentials.email.includes('gestor')) {
        mockUser = {
          id: '2',
          email: credentials.email,
          nome: 'Gestor Equipe',
          role: 'gestor',
          plano: 'profissional',
          equipe_id: 'team-1',
          cliente_id: 'client-1',
          created_at: new Date().toISOString(),
        };
      } else {
        mockUser = {
          id: '3',
          email: credentials.email,
          nome: 'Inspetor Campo',
          role: 'inspetor',
          plano: 'iniciante',
          equipe_id: 'team-1',
          cliente_id: 'client-1',
          created_at: new Date().toISOString(),
        };
      }

      localStorage.setItem('user', JSON.stringify(mockUser));
      setState({
        user: mockUser,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: 'Credenciais inválidas',
      });
    }
  };

  const register = async (data: RegisterData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // TODO: Replace with actual Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        nome: data.nome,
        role: data.role,
        plano: data.role === 'gestor' ? 'profissional' : 'iniciante',
        created_at: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      setState({
        user: newUser,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: 'Erro ao criar conta',
      });
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      // TODO: Replace with actual Supabase auth
      localStorage.removeItem('user');
      setState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao fazer logout',
      }));
    }
  };

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // TODO: Replace with actual Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao enviar email de recuperação',
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};