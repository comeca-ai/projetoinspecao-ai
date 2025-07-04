import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, CheckCircle, Mail } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterData } from '@/types/auth';
import { passwordSchema } from '@/utils/validation';

const Register: React.FC = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    senha: '',
    nome: '',
    role: 'inspetor', // Default role
    empresa: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password before submitting
    try {
      passwordSchema.parse(formData.senha);
      setPasswordError('');
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setPasswordError(err.errors[0].message);
        return;
      }
    }
    
    try {
      await register(formData);
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear password error when user starts typing
    if (field === 'senha' && passwordError) {
      setPasswordError('');
    }
  };

  // Show success message if registration is complete
  if (showSuccessMessage) {
    return (
      <AuthLayout 
        title="Conta Criada com Sucesso!" 
        subtitle="Verifique seu email para confirmar a conta"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <Alert className="border-green-200 bg-green-50">
            <Mail className="h-4 w-4" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p className="font-medium">Email de confirmação enviado!</p>
                <p className="text-sm">
                  Enviamos um link de confirmação para <strong>{formData.email}</strong>. 
                  Clique no link para ativar sua conta.
                </p>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-gray-600">
            <p>Redirecionando para a página de login em alguns segundos...</p>
            <div className="mt-2">
              <Button
                onClick={() => navigate('/auth/login')}
                className="bg-[#f26522] hover:bg-[#e55a1f] text-white"
              >
                Ir para Login
              </Button>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Criar Conta" 
      subtitle="Comece a gerenciar suas inspeções hoje"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo</Label>
          <Input
            id="nome"
            type="text"
            placeholder="Seu nome completo"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
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
              placeholder="Senha forte necessária"
              value={formData.senha}
              onChange={(e) => handleInputChange('senha', e.target.value)}
              required
              minLength={8}
              disabled={loading}
              className={passwordError ? 'border-red-500' : ''}
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
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
          <div className="text-xs text-gray-500 space-y-1">
            <p>A senha deve conter:</p>
            <ul className="ml-2 space-y-1">
              <li>• Mínimo 8 caracteres</li>
              <li>• Pelo menos 1 letra maiúscula</li>
              <li>• Pelo menos 1 letra minúscula</li>
              <li>• Pelo menos 1 número</li>
              <li>• Pelo menos 1 caractere especial (!@#$%^&*)</li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="empresa">Nome da Empresa (Opcional)</Label>
          <Input
            id="empresa"
            type="text"
            placeholder="Nome da sua empresa"
            value={formData.empresa}
            onChange={(e) => handleInputChange('empresa', e.target.value)}
            disabled={loading}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-[#f26522] hover:bg-[#e55a1f] text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar Conta'
          )}
        </Button>
        
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/auth/login"
              className="text-[#f26522] hover:text-[#e55a1f] font-medium transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            Ao criar sua conta, você começará como <strong>Inspetor</strong>. 
            Você poderá solicitar permissões de gestor posteriormente através do suporte.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;