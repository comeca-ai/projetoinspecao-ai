import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building,
  Mail, 
  Phone, 
  Calendar,
  Users,
  HardDrive,
  TrendingUp,
  MoreVertical,
  Settings,
  Ban,
  RefreshCw,
  Crown,
  AlertTriangle,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  plan: 'iniciante' | 'profissional' | 'enterprise';
  status: 'active' | 'suspended' | 'trial' | 'expired';
  joinDate: string;
  lastActivity: string;
  teamMembers: number;
  activeInspections: number;
  storageUsed: number;
  storageLimit: number;
  monthlyRevenue: number;
  stripeCustomerId: string;
  trialEndsAt?: string;
}

interface ClientCardProps {
  client: Client;
  onAction: (clientId: string, action: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onAction }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', color: 'bg-green-100 text-green-800', icon: null },
      trial: { label: 'Trial', color: 'bg-blue-100 text-blue-800', icon: Clock },
      suspended: { label: 'Suspenso', color: 'bg-red-100 text-red-800', icon: Ban },
      expired: { label: 'Expirado', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        {Icon && <Icon className="mr-1 h-3 w-3" />}
        {config.label}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      iniciante: { label: 'Iniciante', color: 'bg-gray-100 text-gray-800' },
      profissional: { label: 'Profissional', color: 'bg-blue-100 text-blue-800' },
      enterprise: { label: 'Enterprise', color: 'bg-purple-100 text-purple-800', icon: Crown },
    };
    
    const config = planConfig[plan as keyof typeof planConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        {Icon && <Icon className="mr-1 h-3 w-3" />}
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const getStoragePercentage = () => {
    return Math.round((client.storageUsed / client.storageLimit) * 100);
  };

  const isTrialExpiringSoon = () => {
    if (!client.trialEndsAt) return false;
    const trialEnd = new Date(client.trialEndsAt);
    const now = new Date();
    const diffInDays = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 3;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${
      client.status === 'suspended' ? 'border-red-200 bg-red-50' : 
      client.status === 'trial' && isTrialExpiringSoon() ? 'border-yellow-200 bg-yellow-50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-lg">{client.companyName}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{client.contactName}</p>
            <div className="flex items-center gap-2">
              {getStatusBadge(client.status)}
              {getPlanBadge(client.plan)}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction(client.id, 'view')}>
                <Settings className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction(client.id, 'billing')}>
                <Crown className="mr-2 h-4 w-4" />
                Gerenciar Plano
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {client.status === 'active' ? (
                <DropdownMenuItem 
                  onClick={() => onAction(client.id, 'suspend')}
                  className="text-red-600"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Suspender
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => onAction(client.id, 'reactivate')}
                  className="text-green-600"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reativar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Trial Warning */}
        {client.status === 'trial' && client.trialEndsAt && (
          <div className={`p-2 rounded-lg ${isTrialExpiringSoon() ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              Trial expira em: {formatDate(client.trialEndsAt)}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-3 w-3" />
            <span className="truncate">{client.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-3 w-3" />
            <span>{client.phone}</span>
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b">
          <div className="text-center">
            <div className="text-lg font-bold text-[#f26522]">{client.teamMembers}</div>
            <div className="text-xs text-gray-600">Usuários</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{client.activeInspections}</div>
            <div className="text-xs text-gray-600">Inspeções</div>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Armazenamento:</span>
            <span className="font-medium">
              {client.storageUsed}GB / {client.storageLimit}GB
            </span>
          </div>
          <Progress value={getStoragePercentage()} className="h-2" />
          <div className="text-xs text-gray-500">
            {getStoragePercentage()}% utilizado
          </div>
        </div>

        {/* Revenue */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Receita Mensal:</span>
          <div className="text-lg font-bold text-green-600">
            R$ {client.monthlyRevenue.toLocaleString()}
          </div>
        </div>

        {/* Meta Info */}
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Cliente desde:
            </div>
            <span>{formatDate(client.joinDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Última atividade:
            </div>
            <span>{formatLastActivity(client.lastActivity)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Stripe ID:</span>
            <span className="font-mono text-xs">{client.stripeCustomerId}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;