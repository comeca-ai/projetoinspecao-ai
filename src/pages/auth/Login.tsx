import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDemoLogin = (email: string) => {
    setFormData(prev => ({ ...prev, email, password: 'demo123' }));
  };

  return (
    <AuthLayout 
      title="Entrar na Conta" 
      subtitle="Acesse sua conta para gerenciar inspeções"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
              disabled={loading}
            />
            <Label htmlFor="remember" className="text-sm text-gray-600">
              Lembrar de mim
            </Label>
          </div>
          
          <Link
            to="/auth/forgot-password"
            className="text-sm text-[#f26522] hover:text-[#e55a1f] transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-[#f26522] hover:bg-[#e55a1f] text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
        
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link
              to="/auth/register"
              className="text-[#f26522] hover:text-[#e55a1f] font-medium transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </div>
        
        {/* Demo credentials helper */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-3 font-medium">Contas de demonstração (clique para preencher):</p>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => handleDemoLogin('admin@demo.com')}
              disabled={loading}
            >
              <strong className="mr-2">Admin:</strong> admin@demo.com
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => handleDemoLogin('gestor@demo.com')}
              disabled={loading}
            >
              <strong className="mr-2">Gestor:</strong> gestor@demo.com
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => handleDemoLogin('inspetor@demo.com')}
              disabled={loading}
            >
              <strong className="mr-2">Inspetor:</strong> inspetor@demo.com
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <em>Qualquer senha funciona para demonstração</em>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;