import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  FileText,
  Settings,
  BarChart3,
  Template,
  Shield,
  Database,
  Mic,
  CreditCard,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navItems: NavItem[] = [
  // Inspetor
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['inspetor', 'gestor', 'admin'],
  },
  {
    title: 'Minhas Inspeções',
    href: '/inspections',
    icon: ClipboardList,
    roles: ['inspetor'],
  },
  {
    title: 'Relatórios',
    href: '/reports',
    icon: FileText,
    roles: ['inspetor', 'gestor'],
  },
  
  // Gestor
  {
    title: 'Equipe',
    href: '/team',
    icon: Users,
    roles: ['gestor'],
  },
  {
    title: 'Inspeções da Equipe',
    href: '/team-inspections',
    icon: ClipboardList,
    roles: ['gestor'],
  },
  {
    title: 'Templates',
    href: '/templates',
    icon: Template,
    roles: ['gestor'],
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['gestor'],
  },
  {
    title: 'Planos & Cobrança',
    href: '/billing',
    icon: CreditCard,
    roles: ['gestor'],
  },
  
  // Admin
  {
    title: 'Clientes',
    href: '/admin/clients',
    icon: Shield,
    roles: ['admin'],
  },
  {
    title: 'Sistema',
    href: '/admin/system',
    icon: Database,
    roles: ['admin'],
  },
  {
    title: 'Logs de Voz',
    href: '/admin/voice-logs',
    icon: Mic,
    roles: ['admin'],
  },
  
  // Shared
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
    roles: ['inspetor', 'gestor', 'admin'],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#f26522] text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Plan indicator */}
      {user && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-1">Plano Atual</p>
            <p className="text-sm font-bold text-[#1e2a39] capitalize">
              {user.plano}
            </p>
            {user.plano === 'iniciante' && (
              <p className="text-xs text-gray-500 mt-1">
                Upgrade para usar assistente virtual
              </p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;