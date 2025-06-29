import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp,
  CheckCircle,
  Star
} from 'lucide-react';

interface TeamStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    totalActiveInspections: number;
    totalCompletedInspections: number;
    averageRating: number;
  };
}

const TeamStats: React.FC<TeamStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total de Membros',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Membros na equipe'
    },
    {
      title: 'Membros Ativos',
      value: stats.active,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Trabalhando ativamente'
    },
    {
      title: 'Inspeções Ativas',
      value: stats.totalActiveInspections,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Em andamento'
    },
    {
      title: 'Inspeções Concluídas',
      value: stats.totalCompletedInspections,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Total finalizado'
    },
    {
      title: 'Avaliação Média',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Qualidade do trabalho'
    },
    {
      title: 'Pendentes',
      value: stats.pending,
      icon: UserX,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      description: 'Aguardando confirmação'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
                {stat.title === 'Avaliação Média' && (
                  <span className="text-sm text-gray-500 ml-1">/5.0</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TeamStats;