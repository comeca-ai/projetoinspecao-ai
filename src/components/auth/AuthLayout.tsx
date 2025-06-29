import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e2a39] to-[#2d3748] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Inspection<span className="text-[#f26522]">Pro</span>
          </h1>
          <p className="text-gray-300">Plataforma SaaS de Gestão de Inspeções</p>
        </div>
        
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <h2 className="text-2xl font-bold text-[#1e2a39]">{title}</h2>
            {subtitle && (
              <p className="text-[#7c7c7c] mt-2">{subtitle}</p>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            © 2024 InspectionPro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;