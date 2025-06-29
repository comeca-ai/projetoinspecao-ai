export type UserRole = 'admin' | 'gestor' | 'inspetor';


export interface User {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  plano: 'iniciante' | 'profissional' | 'enterprise';
  equipe_id?: string;
  cliente_id?: string;
  created_at: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: Date | null;
  user_metadata?: {
    full_name?: string;
    role?: UserRole;
    equipe_id?: string;
    cliente_id?: string;
    [key: string]: any;
  };
  // Cleanup functions for session management
  cleanup?: {
    refresh: () => void;
    timeout: () => void;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  senha: string; // Changed from 'password' to match form field names
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  senha: string; // Changed from 'password' to match form field names
  nome: string;
  role: UserRole;
  equipe_id?: string;
  cliente_id?: string;
  empresa?: string;
}

export interface ForgotPasswordData {
  email: string;
}