export interface User {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'gestor' | 'inspetor';
  plano: 'iniciante' | 'profissional' | 'enterprise';
  equipe_id?: string;
  cliente_id?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  nome: string;
  role: 'gestor' | 'inspetor';
  empresa?: string;
}

export interface ForgotPasswordData {
  email: string;
}