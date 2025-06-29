import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Settings,
  MessageCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'inspetor' | 'gestor';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  location: string;
  activeInspections: number;
  completedInspections: number;
  averageRating: number;
  lastActivity: string;
  specialties: string[];
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inativo', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Pendente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#f26522] text-white">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{member.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(member.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar Mensagem
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-3 w-3" />
            <span className="truncate">{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-3 w-3" />
            <span>{member.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>{member.location}</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b">
          <div className="text-center">
            <div className="text-lg font-bold text-[#f26522]">{member.activeInspections}</div>
            <div className="text-xs text-gray-600">Em Andamento</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{member.completedInspections}</div>
            <div className="text-xs text-gray-600">Concluídas</div>
          </div>
        </div>

        {/* Rating */}
        {member.averageRating > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Avaliação:</span>
            <div className="flex items-center gap-1">
              {renderStars(member.averageRating)}
              <span className="text-sm font-medium ml-1">{member.averageRating.toFixed(1)}</span>
            </div>
          </div>
        )}

        {/* Specialties */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Especialidades:</span>
          <div className="flex flex-wrap gap-1">
            {member.specialties.map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Last Activity */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Última atividade:
          </div>
          <span>{formatLastActivity(member.lastActivity)}</span>
        </div>

        {/* Join Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Membro desde:
          </div>
          <span>{formatDate(member.joinDate)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="mr-2 h-4 w-4" />
            Contatar
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Ver Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;