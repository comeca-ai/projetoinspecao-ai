import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPassword: React.FC = () => {
  const { resetPassword, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (err) {
      // Error is handled by the context
    }
  };

  if (emailSent) {
    return (
      <AuthLayout 
        title="Email Enviado" 
        subtitle="Verifique sua caixa de entrada"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-600">
              Enviamos um link de recuperação para:
            </p>
            <p className="font-medium text-[#1e2a39]">{email}</p>
          </div>
          
          <div className="space-y-3 pt-4">
            <p className="text-sm text-gray-500">
              Não recebeu o email? Verifique sua pasta de spam ou tente novamente.
            </p>
            
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full"
            >
              Tentar outro email
            </Button>
            
            <Link to="/auth/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Recuperar Senha" 
      subtitle="Digite seu email para receber o link de recuperação"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-[#f26522] hover:bg-[#e55a1f] text-white"
          disabled={loading || !email}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Link de Recuperação'
          )}
        </Button>
        
        <div className="text-center pt-4">
          <Link
            to="/auth/login"
            className="inline-flex items-center text-sm text-[#f26522] hover:text-[#e55a1f] transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar ao login
          </Link>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            O link de recuperação será válido por 24 horas. Se você não receber o email em alguns minutos, 
            verifique sua pasta de spam.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;